import type { Network } from '../types/index.js';

export const FACILITATOR_URLS: Record<Network, string> = {
  'polygon-amoy': 'https://x402-amoy.polygon.technology',
  'polygon': 'https://x402.polygon.technology',
};

export const NETWORK_NAMES: Record<Network, string> = {
  'polygon-amoy': 'Polygon Amoy (Testnet)',
  'polygon': 'Polygon Mainnet',
};

export const NETWORK_DESCRIPTIONS: Record<Network, string> = {
  'polygon-amoy': 'Recommended for development and testing',
  'polygon': 'For production deployments',
};

export function getFacilitatorUrl(network: Network): string {
  return FACILITATOR_URLS[network];
}

export function getNetworkName(network: Network): string {
  return NETWORK_NAMES[network];
}

export function getNetworkDescription(network: Network): string {
  return NETWORK_DESCRIPTIONS[network];
}

