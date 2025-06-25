// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * COUNTER SMART CONTRACT
 * ======================
 * This is a simple counter contract where each user (wallet address) can
 * maintain their own personal counter and increment it whenever they want.
 * 
 * Think of it like a digital clicker toy, but everyone gets their own clicker!
 * 
 * KEY FEATURES:
 * - Each wallet address has its own counter (starts at 0)
 * - Users can only increment their own counter (can't mess with others)
 * - We keep track of all users who have ever interacted with the contract
 * - Every increment emits an event (perfect for building leaderboards!)
 */
contract Counter {
    // ==========================================================================
    // STATE VARIABLES (The contract's memory/storage)
    // ==========================================================================
    
    /**
     * MAIN COUNTER STORAGE
     * This mapping stores each user's counter value
     * Key: wallet address (e.g., 0x123...)
     * Value: their current counter number
     * 
     * Example: counters[0x123...] = 5 means that wallet has counted to 5
     */
    mapping(address => uint256) public counters;
    
    /**
     * USER LIST
     * An array containing all wallet addresses that have ever used this contract
     * This is useful for:
     * - Building leaderboards ("show me all users and their scores")
     * - Analytics ("how many people have used this?")
     * - Airdrops ("send tokens to all our users")
     */
    address[] public users;
    
    /**
     * INTERACTION TRACKER
     * Tracks whether a wallet address has ever interacted with this contract
     * This prevents us from adding the same user to the users[] array multiple times
     * 
     * Example: hasInteracted[0x123...] = true means we've seen this wallet before
     */
    mapping(address => bool) public hasInteracted;
    
    // ==========================================================================
    // EVENTS (Blockchain notifications)
    // ==========================================================================
    
    /**
     * COUNTER INCREMENTED EVENT
     * This event is emitted every time someone increments their counter
     * 
     * Why emit events?
     * - Frontend apps can listen for these events in real-time
     * - Subgraphs (like ours) can index this data for easy querying
     * - Creates a permanent log of all activity on the blockchain
     * 
     * Parameters:
     * - user: who incremented their counter
     * - newCount: what their counter value is now
     * - timestamp: when this happened (blockchain time)
     */
    event CounterIncremented(address indexed user, uint256 newCount, uint256 timestamp);
    
    // ==========================================================================
    // FUNCTIONS (What users can do)
    // ==========================================================================
    
    /**
     * INCREMENT FUNCTION
     * This is the main function users call to increase their counter by 1
     * 
     * How it works:
     * 1. Check if this is the user's first time → add them to our user list
     * 2. Increase their counter by 1
     * 3. Emit an event so everyone knows what happened
     * 
     * Note: msg.sender is the wallet address that called this function
     */
    function increment() external {
        // FIRST-TIME USER HANDLING
        // If this wallet has never interacted with our contract before:
        if (!hasInteracted[msg.sender]) {
            users.push(msg.sender);              // Add them to our user list
            hasInteracted[msg.sender] = true;    // Mark them as "seen before"
        }
        
        // THE ACTUAL COUNTER INCREMENT
        // This is where the magic happens - increase their counter by 1!
        counters[msg.sender]++;
        
        // NOTIFY THE WORLD
        // Emit an event so frontends/subgraphs can react to this increment
        emit CounterIncremented(msg.sender, counters[msg.sender], block.timestamp);
    }
    
    // ==========================================================================
    // VIEW FUNCTIONS (Reading data - these don't cost gas)
    // ==========================================================================
    
    /**
     * GET COUNTER VALUE
     * Returns the current counter value for any user
     * 
     * @param user - the wallet address to check
     * @return their current counter value (0 if they've never incremented)
     */
    function getCounter(address user) external view returns (uint256) {
        return counters[user];  // If user never incremented, this returns 0
    }
    
    /**
     * GET TOTAL USER COUNT
     * Returns how many unique users have ever interacted with this contract
     * Great for showing "X people have used this app!"
     */
    function getUserCount() external view returns (uint256) {
        return users.length;
    }
    
    /**
     * GET USER BY INDEX
     * Returns the wallet address of the user at a specific position in our users array
     * Useful for iterating through all users in a frontend
     * 
     * @param index - position in the users array (0 = first user, 1 = second user, etc.)
     * @return the wallet address at that position
     */
    function getUserAt(uint256 index) external view returns (address) {
        require(index < users.length, "Index out of bounds");  // Safety check
        return users[index];
    }
}

// ==============================================================================
// DEMO TALKING POINTS FOR TOMORROW:
// ==============================================================================
// 
// 1. "This is a simple counter where each user gets their own personal counter"
// 2. "When you call increment(), your counter goes up by 1 - that's it!"
// 3. "The contract keeps track of all users and their current counts"
// 4. "Every increment emits an event that our subgraph captures"
// 5. "This creates the data foundation for leaderboards and analytics"
// 6. "It's gas-efficient and demonstrates core Web3 concepts"
//
// LIVE DEMO FLOW:
// 1. Show someone calling increment() → their counter goes from 0 to 1
// 2. Call it again → goes from 1 to 2
// 3. Switch to different wallet → they start at 0 (their own counter)
// 4. Show the events being emitted in the transaction logs
// 5. Show how the subgraph captures this data for easy querying
// ============================================================================== 