# Contributing a New Wallet Adapter

This guide explains exactly what a pull request must include to add a new wallet to `@safrochain/wallet-kit`. Follow every step; incomplete PRs will be closed until all requirements are met.

---

## 1. Adapter folder

Create a new directory:

```
src/wallets/<wallet-name>/
├── registry.ts        # Wallet metadata (Wallet interface)
├── client.ts          # WalletClient implementation
├── chain-wallet.ts    # ChainWalletBase subclass
├── main-wallet.ts     # MainWalletBase subclass (initClient lives here)
└── index.ts           # Barrel: named exports + pre-built instance array
```

Use the Eightsaf adapter (`src/wallets/eightsaf/`) as the canonical reference.

---

## 2. File-by-file requirements

### `registry.ts`

Export a single `const` typed as `Wallet` from `@cosmos-kit/core`. Required fields:

| Field | Description |
|-------|-------------|
| `name` | Unique kebab-case identifier, e.g. `"mywallet-extension"` |
| `prettyName` | Display name shown in the modal |
| `logo` | Absolute URL to a square PNG/SVG icon (≥ 128 × 128 px recommended) |
| `mode` | `'extension'` or `'wallet-connect'` |
| `mobileDisabled` | `true` for browser-extension-only wallets |
| `rejectMessage.source` | The exact string your wallet throws on user rejection |
| `connectEventNamesOnWindow` | Window event(s) that signal an account change (e.g. `['mywallet_keystorechange']`). **Document this in your PR description.** |
| `downloads` | At least one entry with `{ link, platform }` |

### `client.ts`

Export a class that `implements WalletClient` from `@cosmos-kit/core`.

**Mandatory methods:**

```ts
getSimpleAccount(chainId: string): Promise<SimpleAccount>
getOfflineSigner(chainId: string, preferredSignType?: SignType): OfflineSigner | OfflineDirectSigner
```

**Required in `getSimpleAccount` return value:**

```ts
{
  namespace: 'cosmos',   // ← must be exactly 'cosmos'
  chainId,
  address,
  username,
}
```

**Optional but strongly recommended:**

```ts
enable?(chainIds: string | string[]): Promise<void>
signAmino?(...)
signDirect?(...)
sendTx?(...)
addChain?(chainInfo: ChainRecord): Promise<void>
```

**Deduplication & guard patterns** (copy from Eightsaf if your wallet has the same race conditions):

- Module-level `_pendingGetAccounts` map — prevents concurrent `getAccounts()` calls for the same chain.
- Per-instance `_pendingEnable` promise — prevents opening two wallet popups simultaneously.
- Per-instance `_isEnabled` boolean — skips `enable()` on already-approved sessions so auto-reconnect on page refresh works without re-showing the popup.

### `chain-wallet.ts`

```ts
import { ChainWalletBase } from '@cosmos-kit/core';
import type { Wallet, ChainRecord } from '@cosmos-kit/core';

export class ChainMyWalletExtension extends ChainWalletBase {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }
}
```

Add overrides here only if your wallet requires chain-specific behaviour.

### `main-wallet.ts`

```ts
import { MainWalletBase } from '@cosmos-kit/core';
import { ChainMyWalletExtension } from './chain-wallet';
import { MyWalletClient } from './client';
import { MY_WALLET_EXTENSION_INFO } from './registry';

export class MyWalletExtension extends MainWalletBase {
  constructor() {
    super(MY_WALLET_EXTENSION_INFO, ChainMyWalletExtension);
  }

  async initClient(): Promise<void> {
    this.initingClient();
    try {
      if (typeof window !== 'undefined' && window.myWallet) {
        this.initClientDone(new MyWalletClient(window.myWallet));
      } else {
        this.initClientError(new Error('MyWallet extension not detected.'));
      }
    } catch (error) {
      this.initClientError(error as Error);
    }
  }
}
```

### `index.ts`

```ts
export { MY_WALLET_EXTENSION_INFO } from './registry';
export { MyWalletClient } from './client';
export { ChainMyWalletExtension } from './chain-wallet';
export { MyWalletExtension } from './main-wallet';

import { MyWalletExtension } from './main-wallet';
export const myWalletWallets = [new MyWalletExtension()];
```

---

## 3. Register the wallet globally

### `src/wallets/registry.ts`

Add your constructor to `WALLET_REGISTRY`:

```ts
import { MyWalletExtension } from './mywallet/main-wallet';

export const WALLET_REGISTRY: Array<new () => MainWalletBase> = [
  EightsafExtension,
  MyWalletExtension, // ← add here
];
```

### `src/wallets/index.ts`

1. Import and re-export your wallet array:

```ts
import { wallets as myWalletWallets } from './mywallet';
export { myWalletWallets };
```

2. Add it to the combined `wallets` array:

```ts
export const wallets: MainWalletBase[] = [
  ...eightsafWallets,
  ...keplrWallets,
  ...leapWallets,
  ...cosmostationWallets,
  ...myWalletWallets, // ← add here
];
```

### `src/index.ts`

Export anything consumers may need:

```ts
export { MyWalletExtension, MyWalletClient, MY_WALLET_EXTENSION_INFO } from './wallets/mywallet';
export { myWalletWallets } from './wallets';
```

---

## 4. Testing checklist

Your PR must include evidence (automated tests **or** a documented manual checklist) that all four scenarios work:

| # | Scenario | Expected result |
|---|----------|-----------------|
| 1 | **Connect** — user clicks "Connect" and approves in the extension | `address` is populated; `isConnected` returns `true` |
| 2 | **getAccount** — call `getSimpleAccount(chainId)` after connect | Returns `{ namespace: 'cosmos', chainId, address, username }` |
| 3 | **Disconnect** — user clicks "Disconnect" | `address` is undefined; `isConnected` returns `false` |
| 4 | **Auto-reconnect** — page is refreshed while wallet is connected | Session is restored without re-showing the wallet popup |

---

## 5. PR description template

```markdown
## New wallet: <WalletName>

### Wallet mode
- [ ] extension
- [ ] wallet-connect

### connectEventNamesOnWindow
`['<event_name>']`

### Testing
<!-- Paste your checklist results or link to test output -->

### Checklist
- [ ] registry.ts with all required fields
- [ ] client.ts implementing WalletClient (namespace: 'cosmos' in getSimpleAccount)
- [ ] chain-wallet.ts
- [ ] main-wallet.ts with initClient
- [ ] index.ts with pre-built instance array
- [ ] Added to src/wallets/registry.ts
- [ ] Added to src/wallets/index.ts (imported + added to wallets[])
- [ ] Added to src/index.ts public barrel
- [ ] connect / getAccount / disconnect / auto-reconnect tested
```

---

## 6. What NOT to do

- Do **not** call `window.<wallet>.enable()` from `enable()` in your client if cosmos-kit calls it too — this causes double popups. Guard with `_isEnabled` and/or `_pendingEnable` as shown in the Eightsaf adapter.
- Do **not** bundle `@cosmos-kit/core`, `@cosmos-kit/react`, or `chain-registry` into your adapter — they are peer dependencies.
- Do **not** add esbuild plugins to `tsup.config.ts` — consumers using `vite-plugin-node-polyfills` are incompatible with them.
