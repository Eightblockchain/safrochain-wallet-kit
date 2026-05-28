export { EIGHTSAF_EXTENSION_INFO } from './registry';
export { EightsafClient } from './client';
export type { EightsafWallet, EightsafAccountData } from './client';
export { ChainEightsafExtension } from './chain-wallet';
export { EightsafExtension } from './main-wallet';

// Import locally so we can construct the pre-built instance array.
import { EightsafExtension as _EightsafExtension } from './main-wallet';

/** Pre-built wallet array — pass directly to ChainProvider.wallets. */
export const eightsafWallets = [new _EightsafExtension()];
