#!/usr/bin/env bun

import { Command } from 'commander';
import { createCommand } from './commands/create.js';

const version = '1.0.0';

const program = new Command();

program
  .name('x402-polygon')
  .description('CLI tool to quickly set up x402 projects on Polygon')
  .version(version);

program
  .command('create')
  .description('Create a new x402 project')
  .argument('[project-name]', 'Project name')
  .option('-t, --template <template>', 'Template (express|hono)', 'express')
  .option('-n, --network <network>', 'Network (polygon-amoy|polygon)', 'polygon-amoy')
  .option('--create-wallet', 'Create a new wallet')
  .option('--wallet <address>', 'Use existing wallet address')
  .option('--endpoint <endpoint>', 'Add endpoint (format: /path:METHOD:price)')
  .action(async (projectName, options) => {
    await createCommand(projectName, options);
  });

program.parse();

