import { WalletService } from '../core/wallet-service.js';
import path from 'path';
import fs from 'fs-extra';

const walletService = new WalletService();

export function validateProjectName(name: string): string | true {
  if (!name || name.trim().length === 0) {
    return 'Project name cannot be empty';
  }

  // Check for invalid characters
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    return 'Project name can only contain letters, numbers, underscores, and hyphens';
  }

  // Check if directory already exists
  const targetPath = path.resolve(process.cwd(), name);
  if (fs.existsSync(targetPath)) {
    return `Directory "${name}" already exists. Please choose a different name.`;
  }

  return true;
}

export function validateWalletAddress(address: string): string | true {
  if (!walletService.validateAddress(address)) {
    return 'Invalid Ethereum address format. Must be 0x followed by 40 hex characters.';
  }
  return true;
}

export function validatePrivateKey(privateKey: string): string | true {
  if (!walletService.validatePrivateKey(privateKey)) {
    return 'Invalid private key format. Must be 64 hex characters (with or without 0x prefix).';
  }
  return true;
}

export function validateEndpointPath(path: string): string | true {
  if (!path.startsWith('/')) {
    return 'Endpoint path must start with /';
  }
  if (path.length < 2) {
    return 'Endpoint path cannot be just /';
  }
  return true;
}

export function validatePrice(price: string): string | true {
  // Match formats like: $0.001, 0.001, $1.50, 1.50
  const priceRegex = /^\$?\d+(\.\d+)?$/;
  if (!priceRegex.test(price)) {
    return 'Invalid price format. Use format like: $0.001 or 0.001';
  }
  return true;
}

