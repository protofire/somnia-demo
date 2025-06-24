import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { CounterIncremented } from "../generated/Counter/Counter"
import { User, CounterIncrement } from "../generated/schema"

export function handleCounterIncremented(event: CounterIncremented): void {
  let userId = event.params.user.toHexString()
  let user = User.load(userId)
  
  if (user == null) {
    user = new User(userId)
    user.count = BigInt.fromI32(0)
  }
  
  user.count = event.params.newCount
  user.lastUpdated = event.params.timestamp
  user.save()
  
  // Create a new CounterIncrement entity
  let incrementId = event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  let increment = new CounterIncrement(incrementId)
  increment.user = userId
  increment.newCount = event.params.newCount
  increment.timestamp = event.params.timestamp
  increment.blockNumber = event.block.number
  increment.transactionHash = event.transaction.hash
  increment.save()
} 