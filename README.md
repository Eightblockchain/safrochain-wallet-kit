# @safrochain/wallet-kit

Plug-and-play wallet connection toolkit for Safrochain dApps.

Wraps [cosmos-kit](https://github.com/cosmology-tech/cosmos-kit) with Safrochain
chain config, asset list, and wallet adapters pre-wired so you can start
building in minutes.

---

## Installation

```bash
npm install @safrochain/wallet-kit @cosmos-kit/react @cosmos-kit/core
```

> **Note** — `@cosmos-kit/core` and `@cosmos-kit/react` are peer dependencies.
> You must install them alongside this package.

**For the built-in wallet selection modal** (optional):

```bash
npm install @interchain-ui/react
```

If you prefer to provide your own `walletModal`, this package is not required.

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
| `rpcEndpoint` | `string` | testnet RPC | Override the RPC endpoint |
| `restEndpoint` | `string` | testnet REST | Override the REST (LCD) endpoint |
| `extraWallets` | `MainWalletBase[]` | `[]` | Append custom wallet adapters |
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

## Wallets

The `wallets` export is a pre-assembled array ready to pass to
`ChainProvider.wallets`:

| Export | Contents |
|---|---|
| `wallets` | Eightsaf + Keplr + Leap + Cosmostation |
| `eightsafWallets` | Eightsaf extension only |
| `keplrWallets` | Keplr (via `@cosmos-kit/keplr`) |
| `leapWallets` | Leap (via `@cosmos-kit/leap`) |
| `cosmostationWallets` | Cosmostation (via `@cosmos-kit/cosmostation`) |

To use a subset or add a custom wallet:

```tsx
import { SafrochainProvider, keplrWallets, MyCustomWallet } from '@safrochain/wallet-kit';

<SafrochainProvider extraWallets={[new MyCustomWallet()]}>
  ...
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
