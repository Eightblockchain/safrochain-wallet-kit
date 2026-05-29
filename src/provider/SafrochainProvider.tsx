import React, { useMemo, type ReactElement } from 'react';
import { ChainProvider } from '@cosmos-kit/react';
import type {
  MainWalletBase,
  EndpointOptions,
  WalletModalProps,
  WalletConnectOptions,
  LogLevel,
} from '@cosmos-kit/core';
import { safrochain, safroAssets, safrochainMainnet, safroAssetsMainnet } from '../chain/safrochain';
import { wallets as defaultWallets } from '../wallets';

export interface SafrochainProviderProps {
  children: React.ReactNode;

  /**
   * Which network to connect to.
   *
   * - `'testnet'` — `safrochain-testnet-1`, RPC/REST at `*.testnet.safrochain.com` (default)
   * - `'mainnet'` — `safrochain-1`, RPC/REST at `*.safrochain.com` (update endpoints when live)
   *
   * @default 'testnet'
   */
  network?: 'testnet' | 'mainnet';

  /**
   * Override the default RPC endpoint.
   *
   * @example 'https://rpc.my-node.com'
   */
  rpcEndpoint?: string;

  /**
   * Override the default REST (LCD) endpoint.
   *
   * @example 'https://rest.my-node.com'
   */
  restEndpoint?: string;

  /**
   * WalletConnect configuration required for mobile wallets
   * (Keplr Mobile, Leap Mobile, Cosmostation Mobile).
   *
   * When omitted, mobile WalletConnect wallets are automatically excluded
   * from the wallet list — preventing console errors about a missing
   * WalletConnect project ID.
   *
   * @example
   * ```tsx
   * <SafrochainProvider
   *   walletConnectOptions={{ signClient: { projectId: 'YOUR_PROJECT_ID' } }}
   * >
   * ```
   */
  walletConnectOptions?: WalletConnectOptions;

  /**
   * cosmos-kit internal log level.
   *
   * Defaults to `'NONE'` to suppress expected noise such as
   * "initClientError: extension not installed" for wallets the user hasn't
   * installed. Set to `'WARN'` or `'DEBUG'` while debugging connection issues.
   *
   * @default 'NONE'
   */
  logLevel?: LogLevel;

  /**
   * Completely replace the default wallet list with your own selection.
   *
   * Use the named wallet exports from this package to build the list:
   *
   * @example Only Keplr and Eightsaf
   * ```tsx
   * import { keplrWallets, eightsafWallets } from '@safrochain/wallet-kit';
   *
   * <SafrochainProvider wallets={[...eightsafWallets, ...keplrWallets]}>
   * ```
   *
   * When omitted, all built-in wallets are used (Eightsaf + Keplr + Leap +
   * Cosmostation), with WalletConnect mobile wallets excluded unless
   * `walletConnectOptions` is also provided.
   */
  wallets?: MainWalletBase[];

  /**
   * Additional wallet adapters to include alongside the built-in set
   * (Eightsaf + Keplr + Leap + Cosmostation).
   *
   * Ignored when `wallets` is provided.
   */
  extraWallets?: MainWalletBase[];

  /**
   * Custom wallet-selection modal component.
   * Forwarded directly to ChainProvider.walletModal.
   * When omitted, cosmos-kit's built-in modal is used.
   */
  walletModal?: (props: WalletModalProps) => ReactElement;

  /**
   * When true, cosmos-kit skips upfront endpoint reachability checks and
   * connects lazily on first use.
   *
   * Useful for local devnets or custom endpoints that may not be reachable
   * at app startup.
   *
   * @default false
   */
  lazyEndpoints?: boolean;
}

/**
 * SafrochainProvider
 *
 * Wraps cosmos-kit's ChainProvider with all Safrochain defaults pre-applied.
 * Drop it at the root of your app and you're ready to connect.
 *
 * @example
 * ```tsx
 * import { SafrochainProvider } from '@safrochain/wallet-kit';
 *
 * createRoot(document.getElementById('root')!).render(
 *   <SafrochainProvider>
 *     <App />
 *   </SafrochainProvider>
 * );
 * ```
 *
 * @example Override endpoints
 * ```tsx
 * <SafrochainProvider
 *   rpcEndpoint="https://rpc.my-node.com"
 *   restEndpoint="https://rest.my-node.com"
 * >
 *   <App />
 * </SafrochainProvider>
 * ```
 */
export function SafrochainProvider({
  children,
  network = 'testnet',
  rpcEndpoint,
  restEndpoint,
  walletConnectOptions,
  logLevel = 'NONE',
  wallets,
  extraWallets,
  walletModal,
  lazyEndpoints = false,
}: SafrochainProviderProps) {
  const chainDef = network === 'mainnet' ? safrochainMainnet : safrochain;
  const assetDef = network === 'mainnet' ? safroAssetsMainnet : safroAssets;
  const chainName = chainDef.chain_name;

  // Stable reference: prevents ChainProvider from tearing down and rebuilding
  // all wallet connections whenever a parent component re-renders.
  // - `wallets` prop fully overrides the default set.
  // - Otherwise, WalletConnect (mobile) wallets are excluded when no
  //   walletConnectOptions are provided to avoid 'missing project ID' errors.
  const allWallets = useMemo<MainWalletBase[]>(() => {
    if (wallets) return wallets;
    const base = walletConnectOptions
      ? defaultWallets
      : defaultWallets.filter(w => w.walletInfo.mode !== 'wallet-connect');
    return extraWallets ? [...base, ...extraWallets] : base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallets, walletConnectOptions, extraWallets]);

  // Build endpointOptions only when the caller provides overrides so we don't
  // shadow the chain's default endpoints unnecessarily.
  const endpointOptions = useMemo<EndpointOptions | undefined>(
    () =>
      rpcEndpoint || restEndpoint
        ? {
            isLazy: lazyEndpoints,
            endpoints: {
              [chainName]: {
                ...(rpcEndpoint && { rpc: [rpcEndpoint] }),
                ...(restEndpoint && { rest: [restEndpoint] }),
              },
            },
          }
        : undefined,
    [chainName, rpcEndpoint, restEndpoint, lazyEndpoints],
  );

  return (
    <ChainProvider
      chains={[chainDef]}
      assetLists={[assetDef]}
      wallets={allWallets}
      throwErrors={false}
      logLevel={logLevel}
      walletConnectOptions={walletConnectOptions}
      endpointOptions={endpointOptions}
      walletModal={walletModal}
    >
      {children}
    </ChainProvider>
  );
}
