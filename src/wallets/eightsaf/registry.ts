import type { Wallet } from '@cosmos-kit/core';

/**
 * Wallet metadata for the Eightsaf browser extension.
 *
 * `connectEventNamesOnWindow` lists the window events that should trigger a
 * re-fetch of account info (e.g. user switches accounts in the extension).
 */
export const EIGHTSAF_EXTENSION_INFO: Wallet = {
  name: 'eightsaf-extension',
  prettyName: 'Eightsaf',
  logo: 'https://cdn.jsdelivr.net/gh/Eightblockchain/safrochain-wallet-kit@main/assets/eightsaf.svg',
  mode: 'extension',
  mobileDisabled: true,
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: ['eightsaf_keystorechange'],
  downloads: [
    {
      link: 'https://chromewebstore.google.com/detail/eightsaf-wallet/hpemogcffkhcoegjbphljmbjepibnpjj',
      browser: 'chrome',
    },
    // Firefox extension not yet published — add entry when available
  ],
};
