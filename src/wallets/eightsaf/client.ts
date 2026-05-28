import type {
  WalletClient,
  SimpleAccount,
  SignType,
  BroadcastMode,
  SignOptions,
  ChainRecord,
} from '@cosmos-kit/core';
import type { StdSignDoc, AminoSignResponse } from '@cosmjs/amino';
import type {
  DirectSignResponse,
  OfflineSigner,
  OfflineDirectSigner,
} from '@cosmjs/proto-signing';

// ---------------------------------------------------------------------------
// Types for the window.eightsaf extension API
// ---------------------------------------------------------------------------

export interface EightsafAccountData {
  readonly address: string;
  readonly algo: 'secp256k1' | 'ed25519' | 'sr25519';
  readonly pubkey: Uint8Array;
  /** Optional – some builds of Eightsaf include the account label. */
  readonly name?: string;
}

interface DirectSignDoc {
  bodyBytes?: Uint8Array | null;
  authInfoBytes?: Uint8Array | null;
  chainId?: string | null;
  accountNumber?: bigint | null;
}

export interface EightsafWallet {
  enable(chainId: string | string[]): Promise<void>;
  getAccounts(chainId: string): Promise<readonly EightsafAccountData[]>;
  getOfflineSigner(chainId: string): OfflineSigner & OfflineDirectSigner;
  getOfflineSignerOnlyAmino(chainId: string): OfflineSigner;
  getOfflineSignerAuto(chainId: string): Promise<OfflineSigner | OfflineDirectSigner>;
  signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions,
  ): Promise<AminoSignResponse>;
  signDirect(
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions,
  ): Promise<DirectSignResponse>;
  sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
  /** Keplr-compatible chain suggestion API – may not be present on all builds. */
  experimentalSuggestChain?(chainInfo: unknown): Promise<void>;
}

declare global {
  interface Window {
    eightsaf?: EightsafWallet;
  }
}

// ---------------------------------------------------------------------------
// Module-level deduplicator
//
// Prevents multiple simultaneous window.eightsaf.getAccounts() calls for the
// same chainId. All concurrent callers share the same in-flight Promise and
// the entry is cleaned up when the Promise settles.
// ---------------------------------------------------------------------------

const _pendingGetAccounts = new Map<string, Promise<readonly EightsafAccountData[]>>();

function deduplicatedGetAccounts(
  wallet: EightsafWallet,
  chainId: string,
): Promise<readonly EightsafAccountData[]> {
  const existing = _pendingGetAccounts.get(chainId);
  if (existing) return existing;

  const promise = wallet
    .getAccounts(chainId)
    .finally(() => _pendingGetAccounts.delete(chainId));

  _pendingGetAccounts.set(chainId, promise);
  return promise;
}

// ---------------------------------------------------------------------------
// EightsafClient — implements WalletClient
// ---------------------------------------------------------------------------

export class EightsafClient implements WalletClient {
  readonly client: EightsafWallet;

  /**
   * Guards re-calling enable() on sessions that are already approved.
   * Set to true once enable() succeeds so that page refreshes (auto-reconnect)
   * skip the wallet popup entirely.
   */
  private _isEnabled = false;

  /**
   * Per-instance deduplicator: if two code paths call _internalEnable()
   * simultaneously only one wallet popup is opened; the second caller awaits
   * the same Promise.
   */
  private _pendingEnable: Promise<void> | null = null;

  constructor(client: EightsafWallet) {
    this.client = client;
  }

  // -------------------------------------------------------------------------
  // enable() — intentional no-op at the cosmos-kit call-site.
  //
  // cosmos-kit calls enable() before getSimpleAccount(). For Eightsaf we
  // deliberately skip that external call and instead drive enable() ourselves
  // inside _internalEnable(), which is invoked by getSimpleAccount(). This
  // prevents the wallet popup from firing twice and gives us full control over
  // the deduplication + already-approved guard logic.
  // -------------------------------------------------------------------------
  async enable(_chainIds: string | string[]): Promise<void> {
    // Intentional no-op. See _internalEnable().
  }

  /**
   * Calls window.eightsaf.enable() at most once per instance.
   *
   * - If already enabled (_isEnabled flag), returns immediately (auto-reconnect
   *   on page refresh works without re-showing the popup).
   * - If enable() is already in-flight (_pendingEnable), returns the same
   *   Promise so only one wallet popup is ever shown.
   */
  private _internalEnable(chainId: string): Promise<void> {
    if (this._isEnabled) return Promise.resolve();
    if (this._pendingEnable) return this._pendingEnable;

    this._pendingEnable = this.client
      .enable(chainId)
      .then(() => {
        this._isEnabled = true;
      })
      .finally(() => {
        this._pendingEnable = null;
      });

    return this._pendingEnable;
  }

  // -------------------------------------------------------------------------
  // getSimpleAccount — primary account accessor used by cosmos-kit
  // -------------------------------------------------------------------------
  async getSimpleAccount(chainId: string): Promise<SimpleAccount> {
    const { address, username } = await this._getAccount(chainId);
    return {
      namespace: 'cosmos',
      chainId,
      address,
      username,
    };
  }

  private async _getAccount(chainId: string) {
    // enable() is our responsibility, not cosmos-kit's — call it here.
    await this._internalEnable(chainId);

    const accounts = await deduplicatedGetAccounts(this.client, chainId);
    const first = accounts[0];
    if (!first) {
      throw new Error(
        `[EightsafClient] No accounts found for chain "${chainId}". ` +
          'Make sure the chain is added to the extension.',
      );
    }

    return {
      address: first.address,
      // Use the wallet-provided label when available; fall back to a truncated
      // address so the UI always has something human-readable.
      username: first.name ?? `${first.address.slice(0, 12)}…`,
      algo: first.algo,
      pubkey: first.pubkey,
    };
  }

  // -------------------------------------------------------------------------
  // Offline signers
  // -------------------------------------------------------------------------
  getOfflineSigner(
    chainId: string,
    preferredSignType?: SignType,
  ): OfflineSigner | OfflineDirectSigner {
    if (preferredSignType === 'amino') {
      return this.client.getOfflineSignerOnlyAmino(chainId);
    }
    // Default: direct signer (also satisfies OfflineSigner via getAccounts())
    return this.client.getOfflineSigner(chainId);
  }

  // -------------------------------------------------------------------------
  // Signing
  // -------------------------------------------------------------------------
  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions,
  ): Promise<AminoSignResponse> {
    return this.client.signAmino(chainId, signer, signDoc, signOptions);
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions,
  ): Promise<DirectSignResponse> {
    return this.client.signDirect(chainId, signer, signDoc, signOptions);
  }

  // -------------------------------------------------------------------------
  // Transaction broadcast
  // -------------------------------------------------------------------------
  async sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode): Promise<Uint8Array> {
    return this.client.sendTx(chainId, tx, mode);
  }

  // -------------------------------------------------------------------------
  // Chain suggestion (Keplr-compatible)
  // -------------------------------------------------------------------------
  async addChain(chainInfo: ChainRecord): Promise<void> {
    if (!this.client.experimentalSuggestChain) return;
    // Pass the raw chain-registry Chain object. Eightsaf (being Safrochain's
    // native wallet) is expected to understand this format directly.
    await this.client.experimentalSuggestChain(chainInfo.chain);
  }
}
