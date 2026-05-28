import React, { useMemo, type ReactElement } from 'react';
import { ChainProvider } from '@cosmos-kit/react';
import type { MainWalletBase, EndpointOptions, WalletModalProps } from '@cosmos-kit/core';
import { safrochain, safroAssets } from '../chain/safrochain';
import { wallets as defaultWallets } from '../wallets';

export interface SafrochainProviderProps {
  children: React.ReactNode;

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
   * Additional wallet adapters to include alongside the built-in set
   * (Eightsaf + Keplr + Leap + Cosmostation).
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
  rpcEndpoint,
  restEndpoint,
  extraWallets,
  walletModal,
  lazyEndpoints = false,
}: SafrochainProviderProps) {
  // Stable reference: prevents ChainProvider from tearing down and rebuilding
  // all wallet connections whenever a parent component re-renders.
  const allWallets = useMemo<MainWalletBase[]>(
    () => (extraWallets ? [...defaultWallets, ...extraWallets] : defaultWallets),
    // extraWallets is typically a stable module-level array; the identity check
    // is intentional here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [extraWallets],
  );

  // Build endpointOptions only when the caller provides overrides so we don't
  // shadow the chain's default endpoints unnecessarily.
  const endpointOptions = useMemo<EndpointOptions | undefined>(
    () =>
      rpcEndpoint || restEndpoint
        ? {
            isLazy: lazyEndpoints,
            endpoints: {
              safrochain: {
                ...(rpcEndpoint && { rpc: [rpcEndpoint] }),
                ...(restEndpoint && { rest: [restEndpoint] }),
              },
            },
          }
        : undefined,
    [rpcEndpoint, restEndpoint, lazyEndpoints],
  );

  return (
    <ChainProvider
      chains={[safrochain]}
      assetLists={[safroAssets]}
      wallets={allWallets}
      throwErrors={false}
      endpointOptions={endpointOptions}
      walletModal={walletModal}
    >
      {children}
    </ChainProvider>
  );
}
