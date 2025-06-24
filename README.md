# Somnia Counter Demo

A simple blockchain demo application with wallet integration, smart contract interaction, and a subgraph for data indexing.

## Components

1. **Node.js App** - Simple web interface with wallet connection and counter functionality
2. **Smart Contract** - Solidity contract that tracks user counters
3. **Subgraph** - Indexes contract events for efficient querying

## Quick Setup

### 1. Install Dependencies

```bash
npm install
cd subgraph && npm install && cd ..
```

### 2. Deploy Smart Contract

1. Compile and deploy the `contracts/Counter.sol` contract to your target network
2. Update the contract address in:
   - `public/index.html` (line ~89: `CONTRACT_ADDRESS`)
   - `app.js` (line ~12: `CONTRACT_ADDRESS`)
   - `subgraph/subgraph.yaml` (line ~8: contract address)

### 3. Setup Subgraph

1. Create the ABI file:
```bash
mkdir -p subgraph/abis
# Copy your compiled contract ABI to subgraph/abis/Counter.json
```

2. Update subgraph configuration:
   - Edit `subgraph/subgraph.yaml` with your contract address and network
   - Update the `startBlock` with the deployment block number

3. Deploy subgraph:
```bash
cd subgraph
npm run codegen
npm run build
npm run deploy-local  # or deploy to The Graph hosted service
```

### 4. Run the Application

```bash
npm start
```

Visit `http://localhost:3000` to use the counter app.

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to connect MetaMask or another Web3 wallet
2. **Increment Counter**: Click "Increment Counter" to send a transaction and increase your count
3. **View Leaderboard**: Navigate to `/leaderboard` to see all users and their counters

## Environment Variables

- `CONTRACT_ADDRESS`: Deployed contract address
- `SUBGRAPH_URL`: URL of your deployed subgraph endpoint
- `PORT`: Server port (default: 3000)

## Network Configuration

The app is configured for mainnet by default. To use a different network:

1. Update the network in `subgraph/subgraph.yaml`
2. Ensure your wallet is connected to the same network
3. Update RPC endpoints if needed

## Development

- Use `npm run dev` for development with auto-restart
- The frontend uses vanilla JavaScript with Web3.js for wallet interaction
- Contract calls are made directly from the frontend
- Data queries go through the subgraph for efficiency 