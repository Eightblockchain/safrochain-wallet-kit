import type { ChainRecord } from '@cosmos-kit/core';

// Derive the exact Chain / AssetList types that cosmos-kit's ChainProvider expects.
// This avoids @chain-registry/types version mismatches between consumers.
type Chain = NonNullable<ChainRecord['chain']>;
type AssetList = NonNullable<ChainRecord['assetList']>;

/**
 * Safrochain chain definition in chain-registry v1 (snake_case) format.
 *
 * Pass this directly to ChainProvider.chains, or use SafrochainProvider which
 * does it for you.
 *
 * RPC / REST endpoints are set to known testnet values. Override them via the
 * SafrochainProvider `rpcEndpoint` / `restEndpoint` props, or via
 * ChainProvider's `endpointOptions`.
 */
export const safrochain: Chain = {
  chain_name: 'safrochain',
  chain_type: 'cosmos',
  chain_id: 'safrochain-testnet-1',
  pretty_name: 'Safrochain',
  status: 'live',
  network_type: 'testnet',
  bech32_prefix: 'addr_safro',
  bech32_config: {
    bech32PrefixAccAddr: 'addr_safro',
    bech32PrefixAccPub: 'addr_safropub',
    bech32PrefixValAddr: 'addr_safrovaloper',
    bech32PrefixValPub: 'addr_safrovaloperpub',
    bech32PrefixConsAddr: 'addr_safrovalcons',
    bech32PrefixConsPub: 'addr_safrovalconspub',
  },
  slip44: 118,
  fees: {
    fee_tokens: [
      {
        denom: 'usaf',
        fixed_min_gas_price: 0,
        low_gas_price: 0.01,
        average_gas_price: 0.025,
        high_gas_price: 0.04,
      },
    ],
  },
  staking: {
    staking_tokens: [{ denom: 'usaf' }],
  },
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

/**
 * Safrochain native asset list.
 *
 * Pass this directly to ChainProvider.assetLists, or use SafrochainProvider.
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
