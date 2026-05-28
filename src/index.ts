// ─── Chain config ────────────────────────────────────────────────────────────
export { safrochain, safroAssets } from './chain/safrochain';

// ─── Wallets ─────────────────────────────────────────────────────────────────
export {
  wallets,
  eightsafWallets,
  keplrWallets,
  leapWallets,
  cosmostationWallets,
} from './wallets';

// Eightsaf adapter internals (for advanced usage / custom wallet-connect flows)
export {
  EightsafExtension,
  ChainEightsafExtension,
  EightsafClient,
  EIGHTSAF_EXTENSION_INFO,
} from './wallets/eightsaf';
export type { EightsafWallet, EightsafAccountData } from './wallets/eightsaf';

// ─── Provider ────────────────────────────────────────────────────────────────
export { SafrochainProvider } from './provider/SafrochainProvider';
export type { SafrochainProviderProps } from './provider/SafrochainProvider';

// ─── Hooks ───────────────────────────────────────────────────────────────────
export { useSafrochain } from './hooks/useSafrochain';
export type { UseSafrochain } from './hooks/useSafrochain';
