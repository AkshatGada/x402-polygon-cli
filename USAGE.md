# Usage Guide

## Running the CLI Locally

Since the CLI is not yet published to npm, use one of these methods:

### Method 1: Direct Run (Recommended)
```bash
cd /Users/agada/x402-polygon-cli
bun run cli create
# or
bun run src/index.ts create
```

### Method 2: Using Bun Link (After linking)
```bash
# First time setup (already done):
cd /Users/agada/x402-polygon-cli
bun link

# Then you can use:
x402-polygon create
```

### Method 3: Using npm/bun link in another project
```bash
# In your project directory:
bun link x402-polygon-cli
# Then use:
x402-polygon create
```

### Method 4: Add to PATH (for global access)
```bash
# Add to your ~/.zshrc or ~/.bashrc:
export PATH="/Users/agada/x402-polygon-cli:$PATH"

# Then reload:
source ~/.zshrc

# Now you can use:
x402-polygon create
```

## Examples

```bash
# Interactive mode
bun run cli create

# With project name
bun run cli create my-project

# Non-interactive mode
bun run cli create my-project \
  --template express \
  --network polygon-amoy \
  --create-wallet \
  --endpoint "/weather:GET:$0.001"
```

## Publishing to npm (Future)

When ready to publish:
```bash
npm publish
# Then users can use:
bunx x402-polygon create
```

