# Getting Started with x402-polygon CLI

## Quick Start

```bash
# Run the interactive wizard
bunx x402-polygon create

# Or specify project name
bunx x402-polygon create my-project
```

## Interactive Wizard Flow

The CLI will guide you through:

1. **Project Name** - Choose a name for your project
2. **Template Selection** - Express or Hono
3. **Network Selection** - Polygon Amoy (testnet) or Polygon Mainnet
4. **Wallet Setup** - Create new, import existing, or skip
5. **Endpoint Configuration** - Optionally configure your first protected endpoint
6. **Summary & Confirmation** - Review your choices before setup

## Example Session

```
$ bunx x402-polygon create

╔══════════════════════════════════════════════════════╗
║   Welcome to x402-polygon CLI! 🚀                    ║
║   Let's set up your x402 project on Polygon          ║
╚══════════════════════════════════════════════════════╝

? What's your project name? my-x402-api
✓ Project name: my-x402-api

─────────────────────────────────────────────────────────

? Which template would you like to use?
  ❯ Express (JavaScript/TypeScript)
    Hono (TypeScript, modern & fast)

✓ Template: Express

─────────────────────────────────────────────────────────

? Which Polygon network?
  ❯ Polygon Amoy (Testnet) - Recommended for development
    Polygon Mainnet - For production

✓ Network: polygon-amoy
✓ Facilitator URL: https://x402-amoy.polygon.technology

─────────────────────────────────────────────────────────

? How would you like to handle your wallet?
  ❯ Create a new wallet (I'll generate one for you)
    Use an existing wallet address
    Skip for now (set up later)

✓ Creating new wallet...

🔐 New Wallet Generated!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Network: polygon-amoy

⚠️  IMPORTANT: Save your mnemonic phrase securely!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
word1 word2 word3 word4 word5 word6 word7 word8 word9 
word10 word11 word12

✓ Wallet saved to .env file

─────────────────────────────────────────────────────────

? Would you like to configure your first protected endpoint? (Y/n)
  ❯ Yes, let me set it up
    No, I'll add endpoints later

? Endpoint path: /weather
? HTTP method: GET
? Price (in USDC): $0.001
? Description (optional): Get current weather data

✓ Endpoint configured: GET /weather ($0.001)

─────────────────────────────────────────────────────────

📋 Setup Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Project Name:     my-x402-api
Template:         Express
Network:          polygon-amoy
Facilitator URL:  https://x402-amoy.polygon.technology
Wallet Address:   0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Endpoints:        GET /weather ($0.001)

? Does this look good? (Y/n) ✓

─────────────────────────────────────────────────────────

🚀 Setting up your project...

⏳ Downloading template...        [████████████] 100%
⏳ Installing dependencies...     [████████████] 100%
⏳ Configuring project...         [████████████] 100%
⏳ Creating files...              [████████████] 100%

✅ Project created successfully!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 Location: /path/to/my-x402-api
🚀 Next steps:
   1. cd my-x402-api
   2. bun run dev
   3. Test your endpoint: curl http://localhost:4021/weather

💡 Tip: Your wallet mnemonic is saved in .env
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Non-Interactive Mode

For CI/CD or automation:

```bash
bunx x402-polygon create my-project \
  --template express \
  --network polygon-amoy \
  --create-wallet \
  --endpoint "/weather:GET:$0.001"
```

## Networks

- **Polygon Amoy (Testnet)**: `https://x402-amoy.polygon.technology`
- **Polygon Mainnet**: `https://x402.polygon.technology`

## Templates

### Express
- JavaScript/TypeScript
- Uses `x402-express` middleware
- Simple and well-documented

### Hono
- TypeScript only
- Uses `x402-hono` middleware
- Modern, fast, and lightweight

## Wallet Options

1. **Create New** - Generates a new wallet with mnemonic phrase
2. **Import Existing** - Use your own wallet address or private key
3. **Skip** - Set up wallet later in `.env` file

## Project Structure

After creation, your project will have:

```
my-x402-api/
├── server.js (or index.ts for Hono)
├── package.json
├── .env
├── .env.example
├── .gitignore
└── README.md
```

## Next Steps

1. `cd` into your project directory
2. Run `bun run dev` to start the server
3. Test your endpoint with curl or Postman
4. Customize your endpoints in the server file

## Troubleshooting

### Template download fails
The CLI will automatically fall back to embedded templates if git clone fails.

### Wallet not working
Make sure your `.env` file has the correct `WALLET_ADDRESS` set.

### Dependencies not installing
Run `bun install` manually in your project directory.

## Learn More

- [x402 Documentation](https://x402.org)
- [Polygon Network](https://polygon.technology)

