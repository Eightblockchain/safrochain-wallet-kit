import React, { type ReactElement } from 'react';
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
}: SafrochainProviderProps) {
  const allWallets: MainWalletBase[] = extraWallets
    ? [...defaultWallets, ...extraWallets]
    : defaultWallets;

  // Build endpointOptions only when the caller provides overrides so we don't
  // shadow the chain's default endpoints unnecessarily.
  const endpointOptions: EndpointOptions | undefined =
    rpcEndpoint || restEndpoint
      ? {
          isLazy: true,
          endpoints: {
            safrochain: {
              ...(rpcEndpoint && { rpc: [rpcEndpoint] }),
              ...(restEndpoint && { rest: [restEndpoint] }),
            },
          },
        }
      : undefined;

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
