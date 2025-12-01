import type { WizardState } from '../types/index.js';
import { getFacilitatorUrl } from '../core/config-manager.js';
import { WalletService } from '../core/wallet-service.js';
import {
  promptProjectName,
  promptSetupType,
  promptSettlementType,
  promptTemplate,
  promptNetwork,
  promptWalletOption,
  promptWalletAddress,
  promptPrivateKey,
  promptConfigureEndpoint,
  promptEndpointConfig,
  promptAddMoreEndpoints,
} from '../utils/prompts.js';
import { logger } from '../utils/logger.js';
import chalk from 'chalk';
import boxen from 'boxen';
import inquirer from 'inquirer';

export class Wizard {
  private state: Partial<WizardState> = {
    endpoints: [],
  };

  async run(): Promise<WizardState> {
    // Welcome screen
    this.showWelcome();

    // Step 1: Project name
    this.state.projectName = await promptProjectName();
    logger.success(`Project name: ${this.state.projectName}`);

    // Step 2: Middleware and SDK setup
    const purple = chalk.hex('#8247E5');
    console.log('\n' + purple('─────────────────────────────────────────────────────────') + '\n');
    this.state.setupType = await promptSetupType();
    logger.success(`Setup type: ${this.state.setupType}`);

    // Step 2a: Settlement type (if advanced)
    if (this.state.setupType === 'advanced') {
      this.state.settlementType = await promptSettlementType();
      logger.success(`Settlement type: ${this.state.settlementType}`);
    } else {
      // Simple setup defaults to complete settlement
      this.state.settlementType = 'complete';
    }

    // Step 3: Template selection
    console.log('\n' + purple('─────────────────────────────────────────────────────────') + '\n');
    this.state.template = await promptTemplate();
    logger.success(`Template: ${this.state.template}`);

    // Step 4: Network selection
    console.log('\n' + purple('─────────────────────────────────────────────────────────') + '\n');
    this.state.network = await promptNetwork();
    this.state.facilitatorUrl = getFacilitatorUrl(this.state.network);
    logger.success(`Network: ${this.state.network}`);
    logger.success(`Facilitator URL: ${this.state.facilitatorUrl}`);

    // Step 5: Wallet setup
    console.log('\n' + purple('─────────────────────────────────────────────────────────') + '\n');
    await this.handleWalletSetup();

    // Step 6: Endpoint configuration
    console.log('\n' + purple('─────────────────────────────────────────────────────────') + '\n');
    await this.handleEndpointConfiguration();

    return this.state as WizardState;
  }

  private showWelcome(): void {
    const purple = chalk.hex('#8247E5');
    const welcomeMessage = boxen(
      purple.bold('Welcome to x402-polygon CLI! 🚀\n') +
        'Let\'s set up your x402 project on Polygon',
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'magenta',
      }
    );
    console.log(welcomeMessage);
  }

  private async handleWalletSetup(): Promise<void> {
    const option = await promptWalletOption();

    if (option === 'create') {
      logger.step('Creating new wallet...');
      const walletService = new WalletService();
      const wallet = await walletService.createWallet();

      const purple = chalk.hex('#8247E5');
      const purpleBright = chalk.hex('#A78BFA');
      
      console.log('\n' + purple.bold('🔐 New Wallet Generated!'));
      console.log(purple('━'.repeat(60)));
      console.log(purpleBright(`Address: ${wallet.address}`));
      console.log(purpleBright(`Network: ${this.state.network}`));
      console.log(purple('━'.repeat(60)));
      console.log(chalk.yellow.bold('⚠️  IMPORTANT: Save your mnemonic phrase securely!'));
      console.log(purple('━'.repeat(60)));
      
      // Display mnemonic in a box
      const mnemonicBox = boxen(
        wallet.mnemonic || '',
        {
          padding: 1,
          margin: { top: 1, bottom: 1 },
          borderStyle: 'round',
          borderColor: 'magenta',
        }
      );
      console.log(mnemonicBox);

      this.state.wallet = {
        address: wallet.address,
        mnemonic: wallet.mnemonic,
        source: 'created',
      };
      logger.success('Wallet saved to .env file');
    } else if (option === 'import') {
      const importOption = await inquirer.prompt([
        {
          type: 'list',
          name: 'importType',
          message: 'Import from:',
          choices: [
            { name: 'Private key', value: 'privateKey' },
            { name: 'Wallet address (read-only)', value: 'address' },
          ],
        },
      ]);

      if (importOption.importType === 'privateKey') {
        const privateKey = await promptPrivateKey();
        const walletService = new WalletService();
        const wallet = await walletService.importWallet(privateKey);
        this.state.wallet = {
          address: wallet.address,
          source: 'imported',
        };
        logger.success(`Wallet imported: ${wallet.address}`);
      } else {
        const address = await promptWalletAddress();
        this.state.wallet = {
          address,
          source: 'imported',
        };
        logger.success(`Wallet address set: ${address}`);
      }
    } else {
      this.state.wallet = {
        address: '0x0000000000000000000000000000000000000000',
        source: 'skipped',
      };
      logger.info('Wallet setup skipped. You can configure it later in .env');
    }
  }

  private async handleEndpointConfiguration(): Promise<void> {
    const shouldConfigure = await promptConfigureEndpoint();

    if (!shouldConfigure) {
      logger.info('Skipping endpoint configuration. You can add endpoints later.');
      return;
    }

    let addMore = true;
    while (addMore) {
      const endpoint = await promptEndpointConfig();
      this.state.endpoints!.push(endpoint);
      logger.success(`Endpoint configured: ${endpoint.method} ${endpoint.path} (${endpoint.price})`);

      addMore = await promptAddMoreEndpoints();
    }
  }
}

