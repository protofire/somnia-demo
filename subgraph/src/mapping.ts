// ==============================================================================
// MAPPING LOGIC - EVENT PROCESSING
// ==============================================================================
// This file contains the core logic that processes blockchain events and 
// transforms them into the entities defined in schema.graphql.
//
// When someone calls the increment() function on the Counter smart contract,
// it emits a "CounterIncremented" event. This file catches that event and:
// 1. Updates the user's current counter value
// 2. Creates a historical record of the increment action
// ==============================================================================

import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { CounterIncremented } from "../generated/Counter/Counter"
import { User, CounterIncrement } from "../generated/schema"

/**
 * EVENT HANDLER: Counter Incremented
 * 
 * This function is automatically called whenever a CounterIncremented event
 * is emitted by the Counter smart contract on the blockchain.
 * 
 * The event contains:
 * - user: wallet address of who incremented their counter
 * - newCount: what their counter value is now
 * - timestamp: when this happened
 * 
 * @param event - The blockchain event data
 */
export function handleCounterIncremented(event: CounterIncremented): void {
  // Extract the user's wallet address from the event and convert to string
  let userId = event.params.user.toHexString()
  
  // Try to load existing user data from our indexed database
  let user = User.load(userId)
  
  // If this is the first time we've seen this user, create a new User entity
  if (user == null) {
    user = new User(userId)
    user.count = BigInt.fromI32(0)  // Initialize their counter at 0
  }
  
  // Update the user's current counter value and last activity timestamp
  user.count = event.params.newCount
  user.lastUpdated = event.params.timestamp
  user.save()  // Persist the updated user data
  
  // Create a historical record of this specific increment action
  // Generate a unique ID by combining transaction hash and log index
  let incrementId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  let increment = new CounterIncrement(incrementId)
  
  // Store all the details about this increment event
  increment.user = userId                              // Who did it
  increment.newCount = event.params.newCount          // What their counter became
  increment.timestamp = event.params.timestamp        // When it happened
  increment.blockNumber = event.block.number          // Which blockchain block
  increment.transactionHash = event.transaction.hash  // Transaction reference
  increment.save()  // Persist this increment record
  
  // Result: Now we have both current user state AND historical activity records
  // that can be queried via GraphQL!
}

// ==============================================================================
// DEMO TALKING POINTS:
// 
// 1. "This subgraph automatically indexes our Counter contract events"
// 2. "Every time someone increments their counter, we capture that data"
// 3. "We store both current state (user's current count) and history (all increments)"
// 4. "This makes the blockchain data queryable via GraphQL instead of slow RPC calls"
// 5. "Perfect for building leaderboards, analytics, and real-time UIs"
// ============================================================================== 