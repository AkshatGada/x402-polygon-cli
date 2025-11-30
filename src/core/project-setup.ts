import path from 'path';
import fs from 'fs-extra';
import { execSync } from 'child_process';
import type { WizardState } from '../types/index.js';
import { TemplateManager } from './template-manager.js';
import { TemplateGenerator } from './template-generator.js';
import { logger } from '../utils/logger.js';
import ora from 'ora';
import chalk from 'chalk';
import boxen from 'boxen';

export class ProjectSetup {
  async setup(state: WizardState): Promise<void> {
    const targetPath = path.resolve(process.cwd(), state.projectName);

    // Check if directory exists
    if (await fs.pathExists(targetPath)) {
      throw new Error(`Directory "${state.projectName}" already exists.`);
    }

    const purple = chalk.hex('#8247E5');
    const spinner = ora({
      text: 'Setting up your project...',
      color: 'magenta',
    }).start();

    try {
      // Step 1: Get template
      spinner.text = 'Downloading template...';
      const templateManager = new TemplateManager();
      const templatePath = await templateManager.getTemplate(state.template);
      spinner.succeed('Template downloaded');

      // Step 2: Generate project files
      spinner.start('Generating project files...');
      const generator = new TemplateGenerator();
      await generator.generate(templatePath, targetPath, state);
      spinner.succeed('Project files generated');

      // Step 3: Install dependencies
      spinner.start('Installing dependencies...');
      try {
        execSync('bun install', {
          cwd: targetPath,
          stdio: 'pipe',
        });
        spinner.succeed('Dependencies installed');
      } catch (error) {
        spinner.warn('Dependencies installation had issues. Run "bun install" manually.');
      }

      // Step 4: Show success message
      this.showSuccessMessage(state, targetPath);
    } catch (error) {
      spinner.fail('Setup failed');
      throw error;
    }
  }

  private showSuccessMessage(state: WizardState, targetPath: string): void {
    const purple = chalk.hex('#8247E5');
    const purpleBright = chalk.hex('#A78BFA');
    
    console.log('\n' + purple.bold('✅ Project created successfully!\n'));

    const info = boxen(
      purpleBright.bold('📁 Location: ') + targetPath +
      '\n\n' +
      purpleBright.bold('🚀 Next steps:\n') +
      `   1. cd ${state.projectName}\n` +
      `   2. bun run dev\n` +
      `   3. Test your endpoint: curl http://localhost:4021${state.endpoints[0]?.path || '/weather'}\n\n` +
      (state.wallet?.mnemonic
        ? chalk.yellow.bold('💡 Tip: Your wallet mnemonic is saved in .env\n')
        : chalk.yellow.bold('💡 Tip: Configure your wallet address in .env\n')),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'magenta',
      }
    );

    console.log(info);
  }
}

