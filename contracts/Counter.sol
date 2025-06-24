// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Counter {
    mapping(address => uint256) public counters;
    address[] public users;
    mapping(address => bool) public hasInteracted;
    
    event CounterIncremented(address indexed user, uint256 newCount, uint256 timestamp);
    
    function increment() external {
        if (!hasInteracted[msg.sender]) {
            users.push(msg.sender);
            hasInteracted[msg.sender] = true;
        }
        
        counters[msg.sender]++;
        emit CounterIncremented(msg.sender, counters[msg.sender], block.timestamp);
    }
    
    function getCounter(address user) external view returns (uint256) {
        return counters[user];
    }
    
    function getUserCount() external view returns (uint256) {
        return users.length;
    }
    
    function getUserAt(uint256 index) external view returns (address) {
        require(index < users.length, "Index out of bounds");
        return users[index];
    }
} 