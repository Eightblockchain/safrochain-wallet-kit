import { useChain } from '@cosmos-kit/react';
import type { WalletStatus } from '@cosmos-kit/core';

export interface UseSafrochain {
  /** Bech32 address of the connected account, or undefined when disconnected. */
  address: string | undefined;

  /**
   * True when a wallet is connected and an address is available.
   *
   * Derived as `!!address` rather than `status === 'Connected'` to be resilient
   * against the cosmos-kit double-update race condition where status briefly
   * reads `Connected` before the address has been populated (and vice-versa on
   * disconnect).
   */
  isConnected: boolean;

  /** Raw cosmos-kit WalletStatus. Use `isConnected` for most UI logic. */
  status: WalletStatus;

  /** Human-readable account label provided by the wallet (e.g. "My Wallet"). */
  username: string | undefined;

  /** The MainWalletBase instance for the currently selected wallet. */
  wallet: ReturnType<typeof useChain>['wallet'];

  /** Open the wallet-selection / connection modal. */
  openView: () => void;

  /**
   * Initiate the wallet connection flow.
   * Resolves once the user has approved the connection in the extension.
   */
  connect: () => Promise<void>;

  /** Disconnect the currently connected wallet. */
  disconnect: () => Promise<void>;
}

/**
 * useSafrochain
 *
 * A thin, typed wrapper around cosmos-kit's `useChain`.
 * The hook must be used inside a `<SafrochainProvider>` (or any
 * `<ChainProvider>` that includes the Safrochain chain).
 *
 * Pass the same `network` value you used on `<SafrochainProvider>`.
 *
 * @example
 * ```tsx
 * const { address, isConnected, openView, disconnect } = useSafrochain();
 *
 * return isConnected ? (
 *   <button onClick={disconnect}>Disconnect {address}</button>
 * ) : (
 *   <button onClick={openView}>Connect wallet</button>
 * );
 * ```
 *
 * @example Mainnet
 * ```tsx
 * // App.tsx
 * <SafrochainProvider network="mainnet"><App /></SafrochainProvider>
 *
 * // inside App
 * const { address } = useSafrochain('mainnet');
 * ```
 */
export function useSafrochain(network: 'testnet' | 'mainnet' = 'testnet'): UseSafrochain {
  const chainName = network === 'mainnet' ? 'safrochain-mainnet' : 'safrochain';
  const { address, status, connect, disconnect, openView, username, wallet } =
    useChain(chainName);

  return {
    address,
    // Derive connectivity from the address — not from status — to avoid the
    // cosmos-kit double-update race condition.
    isConnected: !!address,
    status,
    username,
    wallet,
    openView,
    connect,
    disconnect,
  };
}
