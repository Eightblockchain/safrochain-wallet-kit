# @safrochain/wallet-kit

Plug-and-play wallet connection toolkit for Safrochain dApps.

Wraps [cosmos-kit](https://github.com/cosmology-tech/cosmos-kit) with Safrochain
chain config, asset list, and wallet adapters pre-wired so you can start
building in minutes.

---

## Installation

```bash
# npm
npm install @safrochain/wallet-kit @cosmos-kit/react @cosmos-kit/core

# pnpm
pnpm add @safrochain/wallet-kit @cosmos-kit/react @cosmos-kit/core

# yarn
yarn add @safrochain/wallet-kit @cosmos-kit/react @cosmos-kit/core
```

> **Why the extra packages?**
> `@cosmos-kit/react` and `@cosmos-kit/core` are **peer dependencies** — they are
> not bundled inside `@safrochain/wallet-kit`. You must install them in your project.
> Copying only `npm i @safrochain/wallet-kit` from the npm page will leave them out
> and cause a runtime crash (`Cannot find module '@cosmos-kit/react'`).

**For the built-in wallet selection modal** (optional):

```bash
# npm
npm install @interchain-ui/react

# pnpm
pnpm add @interchain-ui/react

# yarn
yarn add @interchain-ui/react
```

Also add the styles import once in your app entry point:

```ts
import '@interchain-ui/react/styles';
```

If you provide a custom `walletModal` prop to `<SafrochainProvider>`, this package is not required.

---

## Quick Start

Wrap your application with `SafrochainProvider` and call `useSafrochain()` in
any child component.

```tsx
// main.tsx
import { SafrochainProvider } from '@safrochain/wallet-kit';
import App from './App';

export default function Root() {
  return (
    <SafrochainProvider>
      <App />
    </SafrochainProvider>
  );
}
```

```tsx
// App.tsx
import { useSafrochain } from '@safrochain/wallet-kit';

export default function App() {
  const { address, isConnected, openView, disconnect } = useSafrochain();

  return isConnected ? (
    <div>
      <p>Connected: {address}</p>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  ) : (
    <button onClick={openView}>Connect Wallet</button>
  );
}
```

---

## `SafrochainProvider` props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Your app tree |
| `network` | `'testnet' \| 'mainnet'` | `'testnet'` | Which network to connect to |
| `rpcEndpoint` | `string` | network RPC | Override the RPC endpoint |
| `restEndpoint` | `string` | network REST | Override the REST (LCD) endpoint |
| `wallets` | `MainWalletBase[]` | all built-in | Replace the wallet list entirely |
| `extraWallets` | `MainWalletBase[]` | `[]` | Append wallets to the default set |
| `walletConnectOptions` | `WalletConnectOptions` | — | WalletConnect config — enables mobile wallets |
| `logLevel` | `LogLevel` | `'NONE'` | cosmos-kit log level (`'NONE'` \| `'WARN'` \| `'DEBUG'`) |
| `walletModal` | `(props: WalletModalProps) => ReactElement` | cosmos-kit default | Custom wallet-selection modal |
| `lazyEndpoints` | `boolean` | `false` | Skip upfront endpoint reachability checks |

---

## `useSafrochain()` return value

```ts
interface UseSafrochain {
  address:     string | undefined;  // Bech32 address or undefined
  isConnected: boolean;             // true when address is available
  status:      WalletStatus;        // raw cosmos-kit status
  username:    string | undefined;  // wallet-provided account label
  wallet:      MainWalletBase | undefined;
  openView:    () => void;          // open the wallet modal
  connect:     () => Promise<void>;
  disconnect:  () => Promise<void>;
}
```

---

## Filtering wallets

By default `SafrochainProvider` includes Eightsaf, Keplr, Leap, and
Cosmostation (extension variants only). Use the `wallets` prop to show only
the wallets your app needs:

```tsx
import {
  SafrochainProvider,
  eightsafWallets,
  keplrWallets,
} from '@safrochain/wallet-kit';

// Show only Eightsaf and Keplr
<SafrochainProvider wallets={[...eightsafWallets, ...keplrWallets]}>
  <App />
</SafrochainProvider>
```

Available wallet arrays:

| Export | Contents |
|---|---|
| `eightsafWallets` | Eightsaf extension |
| `keplrWallets` | Keplr extension + Keplr Mobile |
| `leapWallets` | Leap extension + Leap Mobile |
| `cosmostationWallets` | Cosmostation extension + Cosmostation Mobile |

**Adding a wallet to the default set**

```tsx
import { SafrochainProvider } from '@safrochain/wallet-kit';
import { MyCustomWallet } from './my-wallet';

<SafrochainProvider extraWallets={[new MyCustomWallet()]}>
  <App />
</SafrochainProvider>
```

**Enabling mobile wallets (WalletConnect)**

Mobile wallets are excluded by default because they require a
[WalletConnect project ID](https://cloud.walletconnect.com/). Pass one to
re-enable them:

```tsx
<SafrochainProvider
  walletConnectOptions={{ signClient: { projectId: 'YOUR_WC_PROJECT_ID' } }}
>
  <App />
</SafrochainProvider>
```

---

## Advanced: Use chain config directly

If you need full control over `ChainProvider`:

```ts
import { safrochain, safroAssets, wallets } from '@safrochain/wallet-kit';
import { ChainProvider } from '@cosmos-kit/react';

<ChainProvider
  chains={[safrochain]}
  assetLists={[safroAssets]}
  wallets={wallets}
  throwErrors={false}
>
  ...
</ChainProvider>
```

---

## Adding a custom wallet adapter

See [CONTRIBUTING_WALLET.md](./CONTRIBUTING_WALLET.md) for a step-by-step guide.

---

## Known issues

- **`axios` missing** — `@cosmos-kit/core` uses `axios` internally but does not
  declare it as a dependency. This package includes `axios` as a direct
  dependency as a workaround. If your project also uses `axios`, both will
  resolve to the same version via npm deduplication.

---

## License

MIT
