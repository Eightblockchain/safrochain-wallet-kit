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
  logo: 'https://raw.githubusercontent.com/safrochain/assets/main/wallets/eightsaf/icon.png',
  mode: 'extension',
  mobileDisabled: true,
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: ['eightsaf_keystorechange'],
  downloads: [
    {
      link: 'https://chrome.google.com/webstore/detail/eightsaf',
      browser: 'chrome',
    },
    {
      link: 'https://addons.mozilla.org/en-US/firefox/addon/eightsaf',
      browser: 'firefox',
    },
  ],
};
