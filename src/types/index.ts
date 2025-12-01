export type Template = 'express' | 'hono';
export type Network = 'polygon-amoy' | 'polygon';
export type SetupType = 'simple' | 'advanced';
export type SettlementType = 'optimistic' | 'complete';

export interface WizardState {
  projectName: string;
  setupType: SetupType;
  settlementType: SettlementType; // Always set: 'complete' for simple, user choice for advanced
  template: Template;
  network: Network;
  facilitatorUrl: string;
  wallet?: {
    address: string;
    mnemonic?: string;
    source: 'created' | 'imported' | 'skipped';
  };
  endpoints: Array<{
    path: string;
    method: string;
    price: string;
    description?: string;
  }>;
}

export interface EndpointConfig {
  path: string;
  method: string;
  price: string;
  description?: string;
}

