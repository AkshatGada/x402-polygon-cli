import chalk from 'chalk';

// Purple/magenta theme for Polygon branding
const purple = chalk.hex('#8247E5'); // Polygon purple
const purpleBright = chalk.hex('#A78BFA'); // Lighter purple

export const logger = {
  success: (message: string) => console.log(purple(`✓ ${message}`)),
  error: (message: string) => console.log(chalk.red(`✗ ${message}`)),
  info: (message: string) => console.log(purpleBright(`ℹ ${message}`)),
  warning: (message: string) => console.log(chalk.yellow(`⚠ ${message}`)),
  step: (message: string) => console.log(purple(`→ ${message}`)),
};

