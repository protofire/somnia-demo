# Somnia Counter Demo

A simple counter demo application with wallet integration, built for the Somnia blockchain network.

## Features

- 🔗 **Web3 Wallet Integration**: Connect with MetaMask or other Web3 wallets
- 📊 **Smart Contract Interaction**: Increment counter on Somnia testnet
- 🏆 **Leaderboard**: View top users via The Graph subgraph
- 🚀 **Modern Stack**: Express.js backend + vanilla JS frontend
- ☁️ **Vercel Ready**: Optimized for serverless deployment

## Quick Start

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Open your browser**:
   - Counter: http://localhost:3000
   - Leaderboard: http://localhost:3000/leaderboard

### Vercel Deployment

1. **Connect your GitHub repository to Vercel**

2. **Set environment variables in Vercel dashboard**:
   ```
   CONTRACT_ADDRESS=0x49E389D79401D404cd4FBA55CC831a8224A0C277
   NETWORK=somnia-testnet
   SUBGRAPH_URL=https://api.studio.thegraph.com/query/80513/somnia-counter/v0.0.1
   NODE_ENV=production
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

## Project Structure

```
somnia-demo/
├── api/
│   └── index.js          # Vercel serverless function
├── app.js                # Local development server
├── public/               # Frontend static files
│   ├── index.html        # Counter page
│   ├── leaderboard.html  # Leaderboard page
│   └── js/               # Client-side JavaScript
├── contracts/            # Smart contracts
├── subgraph/            # The Graph subgraph
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies and scripts
```

## API Endpoints

- `GET /` - Counter page
- `GET /leaderboard` - Leaderboard page
- `GET /api/health` - Health check
- `GET /api/counter/:address` - Get user's counter value
- `GET /api/leaderboard` - Get leaderboard data

## Smart Contract

The demo interacts with a Counter contract deployed on Somnia testnet:
- **Address**: `0x49E389D79401D404cd4FBA55CC831a8224A0C277`
- **Network**: Somnia Testnet
- **Functions**: `increment()`, `getCounter(address)`

## Development

### Scripts

- `npm start` - Start local server
- `npm run dev` - Start with nodemon (auto-reload)
- `npm run build` - Build check (no build step required)
- `npm run deploy` - Deploy to Vercel

### Environment Variables

For local development, copy `config.example.js` to `config.js` and customize as needed.

For production deployment on Vercel, set these environment variables:
- `CONTRACT_ADDRESS` - Smart contract address
- `NETWORK` - Blockchain network name
- `SUBGRAPH_URL` - The Graph subgraph endpoint
- `NODE_ENV` - Environment (production)

## Technologies

- **Frontend**: HTML5, CSS3, Vanilla JavaScript, Web3.js
- **Backend**: Node.js, Express.js
- **Blockchain**: Somnia Network, Solidity
- **Data**: The Graph Protocol
- **Deployment**: Vercel (Serverless) 