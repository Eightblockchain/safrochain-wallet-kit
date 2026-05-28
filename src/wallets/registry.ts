import type { MainWalletBase } from '@cosmos-kit/core';
import { EightsafExtension } from './eightsaf/main-wallet';

/**
 * Master registry of all supported wallet adapters.
 *
 * Each entry is a constructor (not an instance) so consumers can instantiate
 * wallets themselves if needed. The pre-built instance arrays (`eightsafWallets`,
 * `keplrWallets`, etc.) are the recommended way to consume this.
 */
export const WALLET_REGISTRY: Array<new () => MainWalletBase> = [EightsafExtension];
