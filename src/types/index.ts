export type Template = 'express' | 'hono';
export type Network = 'polygon-amoy' | 'polygon';

export interface WizardState {
  projectName: string;
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

