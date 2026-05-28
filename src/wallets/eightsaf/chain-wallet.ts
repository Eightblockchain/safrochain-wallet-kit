import { ChainWalletBase } from '@cosmos-kit/core';
import type { Wallet, ChainRecord } from '@cosmos-kit/core';

/**
 * Per-chain wallet instance for the Eightsaf extension.
 *
 * ChainWalletBase handles all the boilerplate; no custom overrides are needed
 * for the initial release. This class exists so the adapter follows the
 * standard cosmos-kit pattern and remains extensible.
 */
export class ChainEightsafExtension extends ChainWalletBase {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }
}
