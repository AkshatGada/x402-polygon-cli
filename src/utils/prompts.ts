import inquirer from 'inquirer';
import type { Template, Network, EndpointConfig } from '../types/index.js';
import { validateProjectName, validateWalletAddress, validatePrivateKey, validateEndpointPath, validatePrice } from './validators.js';

export async function promptProjectName(): Promise<string> {
  const { projectName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: "What's your project name?",
      validate: (input: string) => {
        const result = validateProjectName(input);
        return result === true ? true : result;
      },
    },
  ]);
  return projectName;
}

export async function promptTemplate(): Promise<Template> {
  const { template } = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Which template would you like to use?',
      choices: [
        {
          name: 'Express (JavaScript/TypeScript) - Popular and well-documented',
          value: 'express',
        },
        {
          name: 'Hono (TypeScript) - Modern, fast, and lightweight',
          value: 'hono',
        },
      ],
    },
  ]);
  return template;
}

export async function promptNetwork(): Promise<Network> {
  const { network } = await inquirer.prompt([
    {
      type: 'list',
      name: 'network',
      message: 'Which Polygon network?',
      choices: [
        {
          name: 'Polygon Amoy (Testnet) - Recommended for development',
          value: 'polygon-amoy',
        },
        {
          name: 'Polygon Mainnet - For production',
          value: 'polygon',
        },
      ],
    },
  ]);
  return network;
}

export async function promptWalletOption(): Promise<'create' | 'import' | 'skip'> {
  const { option } = await inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: 'How would you like to handle your wallet?',
      choices: [
        {
          name: "Create a new wallet (I'll generate one for you)",
          value: 'create',
        },
        {
          name: 'Use an existing wallet address',
          value: 'import',
        },
        {
          name: 'Skip for now (set up later)',
          value: 'skip',
        },
      ],
    },
  ]);
  return option;
}

export async function promptWalletAddress(): Promise<string> {
  const { address } = await inquirer.prompt([
    {
      type: 'input',
      name: 'address',
      message: 'Enter your wallet address:',
      validate: (input: string) => {
        const result = validateWalletAddress(input);
        return result === true ? true : result;
      },
    },
  ]);
  return address;
}

export async function promptPrivateKey(): Promise<string> {
  const { privateKey } = await inquirer.prompt([
    {
      type: 'password',
      name: 'privateKey',
      message: 'Enter your private key:',
      mask: '*',
      validate: (input: string) => {
        const result = validatePrivateKey(input);
        return result === true ? true : result;
      },
    },
  ]);
  return privateKey;
}

export async function promptConfigureEndpoint(): Promise<boolean> {
  const { configure } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'configure',
      message: 'Would you like to configure your first protected endpoint?',
      default: true,
    },
  ]);
  return configure;
}

export async function promptEndpointConfig(): Promise<EndpointConfig> {
  const { path, method, price, description } = await inquirer.prompt([
    {
      type: 'input',
      name: 'path',
      message: 'Endpoint path:',
      default: '/weather',
      validate: (input: string) => {
        const result = validateEndpointPath(input);
        return result === true ? true : result;
      },
    },
    {
      type: 'list',
      name: 'method',
      message: 'HTTP method:',
      choices: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      default: 'GET',
    },
    {
      type: 'input',
      name: 'price',
      message: 'Price (in USDC):',
      default: '$0.001',
      validate: (input: string) => {
        const result = validatePrice(input);
        return result === true ? true : result;
      },
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description (optional):',
      default: '',
    },
  ]);

  return {
    path,
    method,
    price,
    description: description || undefined,
  };
}

export async function promptAddMoreEndpoints(): Promise<boolean> {
  const { addMore } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'addMore',
      message: 'Would you like to add another endpoint?',
      default: false,
    },
  ]);
  return addMore;
}

export async function promptConfirmation(message: string): Promise<boolean> {
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message,
      default: true,
    },
  ]);
  return confirmed;
}

