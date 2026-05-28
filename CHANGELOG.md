# Changelog — `@safrochain/wallet-kit`

All notable changes are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

### Version bump rules

| Change type | Example | Bump |
|---|---|---|
| Bug fix, dependency update, internal refactor | Fix auto-reconnect race | **patch** `0.1.x` |
| New exported symbol, new wallet adapter, new optional prop | Add Cosmostation Mobile | **minor** `0.x.0` |
| Renamed/removed export, changed prop type, dropped peer dep support | Rename `useSafrochain` → `useWallet` | **major** `x.0.0` |

---

## [Unreleased]

## [0.1.0] — 2026-05-28

### Added

- **`SafrochainProvider`** — wraps cosmos-kit `ChainProvider` with Safrochain
  defaults pre-applied (`chain_id: safrochain-testnet-1`, prefix `addr_safro`,
  token `usaf`/SAF). Accepts optional `rpcEndpoint`, `restEndpoint`,
  `extraWallets`, and `walletModal` overrides.

- **`useSafrochain()`** — typed hook wrapping `useChain('safrochain')`.
  `isConnected` is derived from `!!address` (not `status === Connected`) to be
  resilient against the cosmos-kit double-update race condition.

- **`wallets`** — pre-assembled `MainWalletBase[]` array containing Eightsaf,
  Keplr, Leap, and Cosmostation adapters. Also exported individually as
  `eightsafWallets`, `keplrWallets`, `leapWallets`, `cosmostationWallets`.

- **`safrochain`** chain config and **`safroAssets`** asset list in
  chain-registry v1 (snake_case) format — for advanced consumers who build
  their own `ChainProvider`.

- **Eightsaf wallet adapter** (`EightsafExtension`, `EightsafClient`,
  `ChainEightsafExtension`):
  - Module-level `_pendingGetAccounts` `Map` — prevents concurrent
    `window.eightsaf.getAccounts()` calls for the same chain.
  - Per-instance `_pendingEnable` deduplicator — prevents double wallet popups.
  - `_isEnabled` guard — skips `enable()` on already-approved sessions so
    auto-reconnect on page refresh works without re-showing the popup.
  - `getSimpleAccount` always returns `namespace: 'cosmos'`.

- **`CONTRIBUTING_WALLET.md`** — step-by-step guide for adding new wallet
  adapters (file layout, required interface, deduplication patterns, testing
  checklist, PR template).

- Dual **ESM + CJS** build via `tsup` (no esbuild plugins).

[Unreleased]: https://github.com/safrochain/safrochain-js/compare/@safrochain/wallet-kit@0.1.0...HEAD
[0.1.0]: https://github.com/safrochain/safrochain-js/releases/tag/%40safrochain%2Fwallet-kit%400.1.0
