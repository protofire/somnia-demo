// Configuration Example for Somnia Counter Demo
// Copy this file to config.js and update with your values

module.exports = {
  // Server Configuration
  port: process.env.PORT || 3000,
  
  // Smart Contract Configuration
  contractAddress: process.env.CONTRACT_ADDRESS || '0x49E389D79401D404cd4FBA55CC831a8224A0C277',
  
  // Subgraph Configuration
  subgraphUrl: process.env.SUBGRAPH_URL || 'https://proxy.somnia.chain.love/subgraphs/name/somnia-testnet/demo',
  
  // Network Configuration
  network: process.env.NETWORK || 'somnia-testnet',
  
  // RPC Endpoints (optional - for direct contract calls)
  rpcEndpoints: {
    mainnet: 'https://dream-rpc.somnia.network',
  },
  
  // CORS Configuration
  cors: {
    origin: ['*'],
    credentials: true
  }
}; 