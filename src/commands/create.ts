import path from 'path';
import { Wizard } from '../wizard/wizard.js';
import { ProjectSetup } from '../core/project-setup.js';
import { logger } from '../utils/logger.js';
import chalk from 'chalk';
import boxen from 'boxen';
import type { WizardState } from '../types/index.js';
import { getNetworkName } from '../core/config-manager.js';

export async function createCommand(projectName?: string, options?: any): Promise<void> {
  try {
    let state: WizardState;

    if (projectName && options.template && options.network) {
      // Non-interactive mode
      state = await createNonInteractive(projectName, options);
    } else {
      // Interactive wizard mode
      const wizard = new Wizard();
      if (projectName) {
        // Pre-fill project name if provided
        wizard['state'].projectName = projectName;
      }
      state = await wizard.run();
    }

    // Show summary
    showSummary(state);

    // Confirm before proceeding
    const { default: inquirer } = await import('inquirer');
    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: 'Does this look good?',
        default: true,
      },
    ]);

    if (!confirmed) {
      logger.info('Setup cancelled.');
      process.exit(0);
    }

    // Setup project
    const purple = chalk.hex('#8247E5');
    console.log('\n' + purple('─────────────────────────────────────────────────────────') + '\n');
    const setup = new ProjectSetup();
    await setup.setup(state);
  } catch (error) {
    logger.error(error instanceof Error ? error.message : 'An error occurred');
    process.exit(1);
  }
}

async function createNonInteractive(
  projectName: string,
  options: any
): Promise<WizardState> {
  const { getFacilitatorUrl } = await import('../core/config-manager.js');
  const { WalletService } = await import('../core/wallet-service.js');

  const network = options.network || 'polygon-amoy';
  const facilitatorUrl = getFacilitatorUrl(network);

  let wallet;
  if (options.createWallet) {
    const walletService = new WalletService();
    const walletResult = await walletService.createWallet();
    wallet = {
      address: walletResult.address,
      mnemonic: walletResult.mnemonic,
      source: 'created' as const,
    };
  } else if (options.wallet) {
    wallet = {
      address: options.wallet,
      source: 'imported' as const,
    };
  } else {
    wallet = {
      address: '0x0000000000000000000000000000000000000000',
      source: 'skipped' as const,
    };
  }

  return {
    projectName,
    template: options.template || 'express',
    network,
    facilitatorUrl,
    wallet,
    endpoints: options.endpoint ? [parseEndpoint(options.endpoint)] : [],
  };
}

function parseEndpoint(endpointStr: string) {
  // Format: "/path:GET:$0.001" or "/path:GET:0.001"
  const parts = endpointStr.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid endpoint format. Use: /path:METHOD:price');
  }
  return {
    path: parts[0],
    method: parts[1],
    price: parts[2],
  };
}

function showSummary(state: WizardState): void {
  const purple = chalk.hex('#8247E5');
  const purpleBright = chalk.hex('#A78BFA');
  
  console.log('\n' + purple.bold('📋 Setup Summary'));
  console.log(purple('━'.repeat(60)));

  const summary = [
    ['Project Name:', state.projectName],
    ['Template:', state.template],
    ['Network:', getNetworkName(state.network)],
    ['Facilitator URL:', state.facilitatorUrl],
    ['Wallet Address:', state.wallet?.address || 'Not set'],
    [
      'Endpoints:',
      state.endpoints.length > 0
        ? state.endpoints.map((e) => `${e.method} ${e.path} (${e.price})`).join(', ')
        : 'None configured',
    ],
  ];

  for (const [label, value] of summary) {
    console.log(purpleBright(label.padEnd(20)) + value);
  }

  console.log(purple('━'.repeat(60)));
}

