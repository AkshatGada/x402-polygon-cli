import { generateMnemonic, mnemonicToAccount, english } from 'viem/accounts';
import { privateKeyToAccount } from 'viem/accounts';
import type { Address } from 'viem';

export interface WalletResult {
  address: Address;
  mnemonic?: string;
  privateKey?: string;
}

export class WalletService {
  /**
   * Create a new wallet with mnemonic phrase
   */
  async createWallet(): Promise<WalletResult> {
    const mnemonic = generateMnemonic(english);
    const account = mnemonicToAccount(mnemonic);
    
    return {
      address: account.address,
      mnemonic,
    };
  }

  /**
   * Import wallet from private key
   */
  async importWallet(privateKey: string): Promise<WalletResult> {
    // Ensure private key has 0x prefix
    const formattedKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
    
    // Validate private key length (64 hex chars + 0x = 66)
    if (formattedKey.length !== 66) {
      throw new Error('Invalid private key length. Must be 64 hex characters.');
    }

    try {
      const account = privateKeyToAccount(formattedKey as `0x${string}`);
      return {
        address: account.address,
        privateKey: formattedKey,
      };
    } catch (error) {
      throw new Error(`Failed to import wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate Ethereum address format
   */
  validateAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Validate private key format
   */
  validatePrivateKey(privateKey: string): boolean {
    const formatted = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
    return /^0x[a-fA-F0-9]{64}$/.test(formatted);
  }
}

