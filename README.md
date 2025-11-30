# x402-polygon CLI

A fast, interactive CLI tool to quickly set up x402 projects on Polygon networks.

[![npm version](https://img.shields.io/npm/v/x402-polygon-cli.svg)](https://www.npmjs.com/package/x402-polygon-cli)
[![npm downloads](https://img.shields.io/npm/dm/x402-polygon-cli.svg)](https://www.npmjs.com/package/x402-polygon-cli)

## Features

- 🚀 Interactive wizard setup (like `npm init`)
- 📦 Express and Hono templates
- 🔐 Built-in wallet creation for Polygon
- ⚡ Powered by Bun for speed
- 🌐 Pre-configured with Polygon facilitator URLs
- 💜 Beautiful purple theme matching Polygon branding

## Installation

```bash
# Using Bun (recommended - fastest)
bunx x402-polygon create my-project

# Or install globally with Bun
bun install -g x402-polygon-cli
x402-polygon create my-project

# Or install globally with npm
npm install -g x402-polygon-cli
x402-polygon create my-project
```

## Usage

```bash
# Interactive wizard
bunx x402-polygon create

# With options
bunx x402-polygon create my-project --template express --network polygon-amoy
```

## Networks

- **Polygon Amoy (Testnet)**: `https://x402-amoy.polygon.technology`
- **Polygon Mainnet**: `https://x402.polygon.technology`

## Development

```bash
# Install dependencies
bun install

# Run in development mode
bun run dev

# Build
bun run build
```

## License

MIT

