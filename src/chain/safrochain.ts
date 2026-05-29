import type { ChainRecord } from '@cosmos-kit/core';

// Derive the exact Chain / AssetList types that cosmos-kit's ChainProvider expects.
// This avoids @chain-registry/types version mismatches between consumers.
type Chain = NonNullable<ChainRecord['chain']>;
type AssetList = NonNullable<ChainRecord['assetList']>;

// Shared bech32 / slip44 / fee config — identical on testnet and mainnet.
const bech32Config = {
  bech32PrefixAccAddr: 'addr_safro',
  bech32PrefixAccPub: 'addr_safropub',
  bech32PrefixValAddr: 'addr_safrovaloper',
  bech32PrefixValPub: 'addr_safrovaloperpub',
  bech32PrefixConsAddr: 'addr_safrovalcons',
  bech32PrefixConsPub: 'addr_safrovalconspub',
};

const feeConfig = {
  fee_tokens: [
    {
      denom: 'usaf',
      fixed_min_gas_price: 0,
      low_gas_price: 0.01,
      average_gas_price: 0.025,
      high_gas_price: 0.04,
    },
  ],
};

const stakingConfig = { staking_tokens: [{ denom: 'usaf' }] };

// ---------------------------------------------------------------------------
// Testnet
// ---------------------------------------------------------------------------

/**
 * Safrochain **testnet** chain definition.
 *
 * chain_name: `'safrochain'`   chain_id: `'safrochain-testnet-1'`
 *
 * Pass directly to `ChainProvider.chains`, or use `<SafrochainProvider network="testnet">`.
 */
export const safrochain: Chain = {
  chain_name: 'safrochain',
  chain_type: 'cosmos',
  chain_id: 'safrochain-testnet-1',
  pretty_name: 'Safrochain Testnet',
  status: 'live',
  network_type: 'testnet',
  bech32_prefix: 'addr_safro',
  bech32_config: bech32Config,
  slip44: 118,
  fees: feeConfig,
  staking: stakingConfig,
  apis: {
    rpc: [{ address: 'https://rpc.testnet.safrochain.com', provider: 'Safrochain' }],
    rest: [{ address: 'https://rest.testnet.safrochain.com', provider: 'Safrochain' }],
  },
  explorers: [
    {
      kind: 'safrochain-explorer',
      url: 'https://explorer.safrochain.com',
      tx_page: 'https://explorer.safrochain.com/txs/${txHash}',
      account_page: 'https://explorer.safrochain.com/accounts/${accountAddress}',
    },
  ],
  keywords: ['safrochain', 'testnet'],
};

// ---------------------------------------------------------------------------
// Mainnet
// ---------------------------------------------------------------------------

/**
 * Safrochain **mainnet** chain definition.
 *
 * chain_name: `'safrochain-mainnet'`   chain_id: `'safrochain-1'`
 *
 * Endpoints will be populated when mainnet launches.
 * Pass directly to `ChainProvider.chains`, or use `<SafrochainProvider network="mainnet">`.
 */
export const safrochainMainnet: Chain = {
  chain_name: 'safrochain-mainnet',
  chain_type: 'cosmos',
  chain_id: 'safrochain-1',
  pretty_name: 'Safrochain',
  status: 'upcoming',
  network_type: 'mainnet',
  bech32_prefix: 'addr_safro',
  bech32_config: bech32Config,
  slip44: 118,
  fees: feeConfig,
  staking: stakingConfig,
  apis: {
    // TODO: fill in when mainnet launches
    rpc: [{ address: 'https://rpc.safrochain.com', provider: 'Safrochain' }],
    rest: [{ address: 'https://rest.safrochain.com', provider: 'Safrochain' }],
  },
  explorers: [
    {
      kind: 'safrochain-explorer',
      url: 'https://explorer.safrochain.com',
      tx_page: 'https://explorer.safrochain.com/txs/${txHash}',
      account_page: 'https://explorer.safrochain.com/accounts/${accountAddress}',
    },
  ],
  keywords: ['safrochain', 'mainnet'],
};

// ---------------------------------------------------------------------------
// Assets  (same denom on both networks)
// ---------------------------------------------------------------------------

/**
 * Safrochain native asset list — used with the **testnet** chain.
 */
export const safroAssets: AssetList = {
  chain_name: 'safrochain',
  assets: [
    {
      description: 'The native staking and governance token of Safrochain',
      denom_units: [
        { denom: 'usaf', exponent: 0, aliases: ['microsaf'] },
        { denom: 'saf', exponent: 6 },
      ],
      type_asset: 'sdk.coin',
      base: 'usaf',
      name: 'Safrochain',
      display: 'saf',
      symbol: 'SAF',
      keywords: ['safrochain', 'native'],
    },
  ],
};

/**
 * Safrochain native asset list — used with the **mainnet** chain.
 */
export const safroAssetsMainnet: AssetList = {
  chain_name: 'safrochain-mainnet',
  assets: [
    {
      description: 'The native staking and governance token of Safrochain',
      denom_units: [
        { denom: 'usaf', exponent: 0, aliases: ['microsaf'] },
        { denom: 'saf', exponent: 6 },
      ],
      type_asset: 'sdk.coin',
      base: 'usaf',
      name: 'Safrochain',
      display: 'saf',
      symbol: 'SAF',
      keywords: ['safrochain', 'native'],
    },
  ],
};
