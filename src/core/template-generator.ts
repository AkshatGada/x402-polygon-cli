import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import type { WizardState } from '../types/index.js';

export class TemplateGenerator {
  /**
   * Generate project from template
   */
  async generate(
    templatePath: string,
    targetPath: string,
    state: WizardState
  ): Promise<void> {
    await fs.ensureDir(targetPath);

    // Try to copy template files if they exist (from git repo)
    if (await fs.pathExists(templatePath)) {
      try {
        await this.copyTemplateFiles(templatePath, targetPath);
      } catch (error) {
        // If copying fails, fall back to generating from scratch
        console.warn('Failed to copy template files, generating from scratch');
      }
    }

    // Generate files with variable replacement (overwrites if they exist)
    await this.generateConfigFiles(targetPath, state);
    await this.generateServerFile(targetPath, state);
    await this.generatePackageJson(targetPath, state);
    await this.generateEnvFile(targetPath, state);
    await this.generateReadme(targetPath, state);
  }

  private async copyTemplateFiles(source: string, target: string): Promise<void> {
    if (!(await fs.pathExists(source))) {
      return;
    }

    const files = await glob('**/*', {
      cwd: source,
      ignore: ['node_modules/**', '.git/**', 'dist/**', '*.log'],
      dot: true,
    });

    for (const file of files) {
      const sourcePath = path.join(source, file);
      const targetPath = path.join(target, file);

      const stat = await fs.stat(sourcePath);
      if (stat.isDirectory()) {
        await fs.ensureDir(targetPath);
      } else {
        await fs.copy(sourcePath, targetPath);
      }
    }
  }

  private async generateConfigFiles(targetPath: string, state: WizardState): Promise<void> {
    // Generate .gitignore if not exists
    const gitignorePath = path.join(targetPath, '.gitignore');
    if (!(await fs.pathExists(gitignorePath))) {
      await fs.writeFile(
        gitignorePath,
        `node_modules/
dist/
*.log
.env
.env.local
.DS_Store
`
      );
    }
  }

  private async generateServerFile(targetPath: string, state: WizardState): Promise<void> {
    if (state.template === 'express') {
      await this.generateExpressServer(targetPath, state);
    } else if (state.template === 'hono') {
      await this.generateHonoServer(targetPath, state);
    }
  }

  private async generateExpressServer(targetPath: string, state: WizardState): Promise<void> {
    const serverPath = path.join(targetPath, 'server.js');
    const endpoints = this.generateEndpointsConfig(state.endpoints, state.network);
    
    // Determine middleware package based on settlement type
    const isOptimistic = state.settlementType === 'optimistic';
    const middlewarePackage = isOptimistic ? 'x402-express-async' : 'x402-express';

    const content = `import express from "express";
import { paymentMiddleware } from "${middlewarePackage}";

const app = express();

const FACILITATOR_URL = process.env.FACILITATOR_URL || "${state.facilitatorUrl}";

console.log("=".repeat(80));
console.log("🚀 X402 Seller Server Configuration");
console.log("=".repeat(80));
console.log(\`📍 Facilitator URL: \${FACILITATOR_URL}\`);
console.log(\`💰 Receiving Wallet: \${state.wallet?.address || 'SET_IN_ENV'}\`);
console.log(\`🌐 Network: ${state.network}\`);
console.log(\`⚡ Settlement: ${isOptimistic ? 'Optimistic (Async)' : 'Complete (On-chain)'}\`);
console.log("=".repeat(80));

app.use(paymentMiddleware(
  process.env.WALLET_ADDRESS || "${state.wallet?.address || '0x0000000000000000000000000000000000000000'}",
  ${endpoints},
  {
    url: FACILITATOR_URL,
  }
));

${this.generateExpressRoutes(state.endpoints)}

const PORT = process.env.PORT || 4021;
app.listen(PORT, () => {
  console.log(\`Server listening at http://localhost:\${PORT}\`);
});
`;

    await fs.writeFile(serverPath, content);
  }

  private async generateHonoServer(targetPath: string, state: WizardState): Promise<void> {
    const serverPath = path.join(targetPath, 'index.ts');
    const endpoints = this.generateEndpointsConfig(state.endpoints, state.network);

    const content = `import { config } from "dotenv";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { paymentMiddleware, Network, Resource } from "x402-hono";

config();

const facilitatorUrl = (process.env.FACILITATOR_URL || "${state.facilitatorUrl}") as Resource;
const payTo = (process.env.WALLET_ADDRESS || "${state.wallet?.address || '0x0000000000000000000000000000000000000000'}") as \`0x\${string}\`;
const network = (process.env.NETWORK || "${state.network}") as Network;

if (!facilitatorUrl || !payTo || payTo === "0x0000000000000000000000000000000000000000") {
  console.error("Missing required environment variables: FACILITATOR_URL and WALLET_ADDRESS");
  process.exit(1);
}

const app = new Hono();

console.log("=".repeat(80));
console.log("🚀 X402 Seller Server Configuration");
console.log("=".repeat(80));
console.log(\`📍 Facilitator URL: \${facilitatorUrl}\`);
console.log(\`💰 Receiving Wallet: \${payTo}\`);
console.log(\`🌐 Network: \${network}\`);
console.log("=".repeat(80));

app.use(
  paymentMiddleware(
    payTo,
    ${endpoints},
    {
      url: facilitatorUrl,
    },
  ),
);

${this.generateHonoRoutes(state.endpoints)}

const PORT = parseInt(process.env.PORT || "4021", 10);
serve({
  fetch: app.fetch,
  port: PORT,
});
`;

    await fs.writeFile(serverPath, content);
  }

  private generateEndpointsConfig(endpoints: WizardState['endpoints'], network: string): string {
    if (endpoints.length === 0) {
      return `{
  "GET /weather": {
    price: "$0.001",
    network: "${network}",
  },
}`;
    }

    const configLines: string[] = [];
    configLines.push('{');
    
    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];
      const key = `"${endpoint.method} ${endpoint.path}"`;
      const isLast = i === endpoints.length - 1;
      
      configLines.push(`  ${key}: {`);
      configLines.push(`    price: "${endpoint.price}",`);
      configLines.push(`    network: "${network}",`);
      
      if (endpoint.description) {
        configLines.push(`    config: {`);
        configLines.push(`      description: "${endpoint.description}",`);
        configLines.push(`    },`);
      }
      
      configLines.push(`  }${isLast ? '' : ','}`);
    }
    
    configLines.push('}');
    
    return configLines.join('\n');
  }

  private generateExpressRoutes(endpoints: WizardState['endpoints']): string {
    if (endpoints.length === 0) {
      return `// Example endpoint
app.get("/weather", (req, res) => {
  res.send({
    report: {
      weather: "cloudy",
      temperature: 70,
    },
  });
});`;
    }

    return endpoints
      .map((endpoint) => {
        const method = endpoint.method.toLowerCase();
        return `// ${endpoint.description || endpoint.path}
app.${method}("${endpoint.path}", (req, res) => {
  res.send({
    message: "Hello from ${endpoint.path}",
    // Add your implementation here
  });
});`;
      })
      .join('\n\n');
  }

  private generateHonoRoutes(endpoints: WizardState['endpoints']): string {
    if (endpoints.length === 0) {
      return `// Example endpoint
app.get("/weather", c => {
  return c.json({
    report: {
      weather: "sunny",
      temperature: 70,
    },
  });
});`;
    }

    return endpoints
      .map((endpoint) => {
        const method = endpoint.method.toLowerCase();
        return `// ${endpoint.description || endpoint.path}
app.${method}("${endpoint.path}", c => {
  return c.json({
    message: "Hello from ${endpoint.path}",
    // Add your implementation here
  });
});`;
      })
      .join('\n\n');
  }

  private async generatePackageJson(targetPath: string, state: WizardState): Promise<void> {
    const packageJsonPath = path.join(targetPath, 'package.json');
    let packageJson: any = {};

    if (await fs.pathExists(packageJsonPath)) {
      packageJson = await fs.readJson(packageJsonPath);
    }

    // Update package.json
    packageJson.name = state.projectName;
    packageJson.type = 'module';
    packageJson.scripts = {
      ...packageJson.scripts,
      start: state.template === 'express' ? 'node server.js' : 'tsx index.ts',
      dev: state.template === 'express' ? 'node --watch server.js' : 'tsx watch index.ts',
    };

    // Ensure x402 dependencies
    if (state.template === 'express') {
      const isOptimistic = state.settlementType === 'optimistic';
      const middlewarePackage = isOptimistic ? 'x402-express-async' : 'x402-express';
      
      packageJson.dependencies = {
        ...packageJson.dependencies,
        express: '^4.18.2',
        [middlewarePackage]: '^0.6.5',
      };
    } else {
      packageJson.dependencies = {
        ...packageJson.dependencies,
        hono: '^4.7.1',
        '@hono/node-server': '^1.13.8',
        'x402-hono': '^0.6.5',
        dotenv: '^16.4.7',
      };
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        tsx: '^4.7.0',
        typescript: '^5.3.0',
      };
    }

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }

  private async generateEnvFile(targetPath: string, state: WizardState): Promise<void> {
    const envPath = path.join(targetPath, '.env');
    const envExamplePath = path.join(targetPath, '.env.example');

    const envContent = `# X402 Configuration
FACILITATOR_URL=${state.facilitatorUrl}
NETWORK=${state.network}
WALLET_ADDRESS=${state.wallet?.address || 'YOUR_WALLET_ADDRESS_HERE'}
PORT=4021

${state.wallet?.mnemonic ? `# Wallet Mnemonic (keep this secret!)
MNEMONIC=${state.wallet.mnemonic}` : ''}
`;

    await fs.writeFile(envPath, envContent);
    await fs.writeFile(
      envExamplePath,
      envContent.replace(/MNEMONIC=.*/, '# MNEMONIC=your_mnemonic_phrase_here')
    );
  }

  private async generateReadme(targetPath: string, state: WizardState): Promise<void> {
    const readmePath = path.join(targetPath, 'README.md');
    const readmeContent = `# ${state.projectName}

X402 seller server on Polygon ${state.network === 'polygon-amoy' ? 'Amoy (Testnet)' : 'Mainnet'}.

## Setup

1. Install dependencies:
\`\`\`bash
bun install
\`\`\`

2. Configure your \`.env\` file with your wallet address.

3. Start the server:
\`\`\`bash
bun run dev
\`\`\`

## Configuration

- **Facilitator URL**: ${state.facilitatorUrl}
- **Network**: ${state.network}
- **Wallet**: ${state.wallet?.address || 'Configure in .env'}

## Endpoints

${state.endpoints.length > 0 ? state.endpoints.map(e => `- \`${e.method} ${e.path}\` - ${e.price}${e.description ? ` - ${e.description}` : ''}`).join('\n') : 'No endpoints configured yet. Add them in your server file.'}

## Learn More

- [x402 Documentation](https://x402.org)
- [Polygon Network](https://polygon.technology)
`;

    await fs.writeFile(readmePath, readmeContent);
  }
}

