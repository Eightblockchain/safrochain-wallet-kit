import type { MainWalletBase } from '@cosmos-kit/core';
import { wallets as keplrWallets } from '@cosmos-kit/keplr';
import { wallets as leapWallets } from '@cosmos-kit/leap';
import { wallets as cosmostationWallets } from '@cosmos-kit/cosmostation';
import { eightsafWallets } from './eightsaf';

// Re-export individual wallet arrays for consumers who want fine-grained control.
export { eightsafWallets } from './eightsaf';
export { keplrWallets };
export { leapWallets };
export { cosmostationWallets };

/**
 * The complete pre-assembled wallet list for Safrochain dApps.
 *
 * Includes Eightsaf (native), Keplr, Leap, and Cosmostation.
 * Pass directly to ChainProvider.wallets (or use SafrochainProvider which does
 * this automatically).
 *
 * @example
 * ```tsx
 * import { wallets } from '@safrochain/wallet-kit';
 * <ChainProvider wallets={wallets} ... />
 * ```
 */
export const wallets: MainWalletBase[] = [
  ...eightsafWallets,
  ...keplrWallets,
  ...leapWallets,
  ...cosmostationWallets,
];
