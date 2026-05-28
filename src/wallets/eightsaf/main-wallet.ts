import { MainWalletBase } from '@cosmos-kit/core';
import { ChainEightsafExtension } from './chain-wallet';
import { EightsafClient } from './client';
import { EIGHTSAF_EXTENSION_INFO } from './registry';

/**
 * Top-level Eightsaf wallet entry-point for cosmos-kit.
 *
 * Pass an instance of this class (or the pre-built `eightsafWallets` array) to
 * ChainProvider.wallets.
 */
export class EightsafExtension extends MainWalletBase {
  constructor() {
    super(EIGHTSAF_EXTENSION_INFO, ChainEightsafExtension);
  }

  /**
   * Initialise the WalletClient for this wallet.
   *
   * Called by cosmos-kit during the connection lifecycle. We check for
   * `window.eightsaf` and either resolve with a new EightsafClient or report
   * an error so cosmos-kit can surface a "wallet not installed" message.
   */
  async initClient(): Promise<void> {
    this.initingClient();
    try {
      if (typeof window !== 'undefined' && window.eightsaf) {
        this.initClientDone(new EightsafClient(window.eightsaf));
      } else {
        this.initClientError(
          new Error(
            'Eightsaf extension not detected. ' +
              'Please install it from the Chrome Web Store or Firefox Add-ons.',
          ),
        );
      }
    } catch (error) {
      this.initClientError(error as Error);
    }
  }
}
