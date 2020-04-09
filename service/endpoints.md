Stats Endpoint
______________
	TODO: latest block
	TODO: average block time (100 blocks)
	TODO: Reward rate in most recent block
	TODO: Transactions sent (24h)
	TODO: Volume (24h)
	TODO: Top 100 Algo Account Value
	TODO: Total Algo Supply
	TODO: Total Unique Addresses

Blocks Endpoint, list of:
_________________________
	- Round
	- Num Transactions
	- Proposer
	- Time

Transactions endpoint, list of:
_______________________________
	- Block
	- Tx ID
	- From
	- To
	- Amount
	- Time

TODO: ON access end points
	- Tx ID (ID< Status, Block, Sender, Type, Receiver, Amount, Fee, Sender balance, Sender rewards, Receiver balance, Receiver rewards, First round, Last round, Created at)
	- Address overview (Balance, Total Transactions received, total sent, Rewards, Status, Transactions list, First block seen)
	- Block overview (Round, Block Hash, Previous Block Hash, Proposer, Transactions num (and list), Created At)

# Sync
## Blocks sync
Schema:
```
{
	hash,
	previousBlockHash,
	seed,
	proposer,
	round,
	period,
	txnRoot,
	reward,
	rate,
	frac,
	txns,
	timestamp,
	currentProtocol,
	nextProtocol,
	nextProtocolApprovals,
	nextProtocolSwitchOn,
	upgradePropose,
	upgradeApprove
}
```
