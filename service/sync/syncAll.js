/*
	syncAll.js
	____________
	Syncs current round with blocks and transactions database.
*/

var constants = require('../global'); // Require global constants
const axios = require('axios'); // Require axios for requests
const nano = require("nano")(`http://${constants.dbuser}:${constants.dbpass}@${constants.dbhost}`); // Connect nano to db

let blocks = nano.db.use('blocks'); // Connect to blocks db
let transactions = nano.db.use('transactions'); // Connect to transactions db
let addresses = nano.db.use('addresses'); // Connect to addresses db

/*
	Update blocks in database based on
	current block in db and highest existing block from blockchain
	Run in bulk when sync is behind by 250+ blocks
*/
async function updateBlocks() {
	// syncedBlockNumber = head round in db
	// currentRound = head round from algod
	let syncedBlockNumber, currentRound;

	syncedBlockNumber = await getSyncedRound(); // Get latest synced round from db - design doc
	currentRound = await getCurrentRound(); // Get latest round

	console.log(`Starting to sync from block ${syncedBlockNumber} to ${currentRound}`);

	setInterval(async() => {
		currentRound = await getCurrentRound(); // Get new latest round every half second
	}, 500);

	// If block handles error when conducting first loop when condition is not met (currentRound - 250 < syncedBlockNumber)
	if (currentRound - 250 > syncedBlockNumber) {
			do {
			// Ignore no-loop-func rule for syncing in do/while
			// eslint-disable-next-line no-loop-func
			await bulkAddBlocks(syncedBlockNumber, currentRound).then(async () => {
				syncedBlockNumber += await 250; // Add 250 blocks, and increment the synced number
			}).catch(error => {
				console.log("Error when incrementing syncedBlockNumber during bulk block addition: " + error);
			});
		} while (currentRound - 250 > syncedBlockNumber);
	} else {
		setTimeout(keepBlocksUpdated, 50);
	}
}

/*
	Update blocks in database based on
	current block in db and highest existing block from blockchain
	Run every 50ms (post-execution time) to keep database in sync with any new data
*/
async function keepBlocksUpdated(lastRound) {
	if (typeof lastRound === 'undefined') {
		lastRound = 0;
	}
	// Wait for synced round
	await getSyncedRound().then(async syncedRound => {
		// Wait for current round
		await getCurrentRound().then(async currentRound => {
			// If synced round < current round
			if (syncedRound < currentRound && lastRound !== currentRound) {
				// Add the new block
				await addBlock(syncedRound + 1, currentRound).then(async () => {
					// Take a quick break for a second and recall
					await setTimeout(function() {
						keepBlocksUpdated(syncedRound + 1);
					}, 500);
				});
			} else {
				// If synced round === current round, recall in 100ms
				await setTimeout(function() {
					keepBlocksUpdated(syncedRound);
				}, 100);
			}
		})
	})
}

/*
	Get current synced round from blocks db
*/
async function getSyncedRound() {
	let round; // declare round variable

	// Query for view and retrieve the latest block
	await nano.db.use('blocks').view('latest', 'latest', {include_docs: true, descending: true, limit: 1}).then((body) => {
		round = body.rows[0].doc.round; // Get the round number from the latest block
	}).catch(error => {
		console.log('Exception when retrieving synced block number: ' + error);
	})

	return round; // Return round number
}

/*
	Get current round number from algod
*/
async function getCurrentRound() {
	let round;
	
	await axios({
		method: 'get',
		url: `${constants.algodurl}/ledger/supply`, // Request /ledger/supply endpoint
		headers: {'X-Algo-API-Token': constants.algodapi}
	}).then(response => {
		round = response.data.round; // Collect round
	}).catch(error => {
		console.log("Exception when getting current round: " + error);
	})

	return round;
}

/*
	Add multiple blocks to CouchDB in bulk
*/
async function bulkAddBlocks(blockNum, currentNum) {
	let blocksArray = []; // to contain 250 blocks
	let transactionsArray = []; // to contain any transactions in those 250 blocks
	let addressesArray = []; // to contain any addresses and their transactions in those 250 blocks
	let increment = 0; // for async loop functionality
	
	while (increment < 250) {
		await axios({
			method: 'get',
			url: `${constants.algodurl}/block/${blockNum + increment + 1}`, // Retrieve each block in succession
			headers: {'X-Algo-API-Token': constants.algodapi}
		}).then(async response => {
			blocksArray.push(response.data); // Push block to array

			let timestamp = response.data.timestamp; // Collect timestamp from block

			if (Object.keys(response.data.txns).length > 0) {
				let alltransactions = response.data.txns.transactions; // Append timestamp from block to transaction

				for (let i = 0; i < alltransactions.length; i++) {
					alltransactions[i].timestamp = timestamp; // Add timestamp to transaction (simplify front-end reporting)
					transactionsArray.push(alltransactions[i]); // Push transaction to transactionsArray

					// TODO: Add support for non-payment transactions
					if (typeof alltransactions[i].payment !== 'undefined') {
						let from_account_id = alltransactions[i].from; // From account
						let to_account_id = alltransactions[i].payment.to; // To account

						// If from account is already in transactions array, append to entry, else update
						if (addressesArray.some(address => address._id === from_account_id)) {
							// From account exists in transactionsArray
							for (let i = 0; i < addressesArray.length; i++) {
								// Find from account i
								if (addressesArray[i]._id === from_account_id) {
									// Update the array in memory to include the new transaction
									addressesArray[i].transactions = [alltransactions[i], ...addressesArray[i]["transactions"]];
								}
							}
						} else {
							// From account is not found in the existing array in memory
							await addresses.get(from_account_id).then(async from_body => {
								// From account already exists in db, update transactions and push to addressesArray
								addressesArray.push({_id: from_body._id, _rev: from_body._rev, transactions: [alltransactions[i], ...from_body["transactions"]]});
							}).catch(async () => {
								// From account does not exist in memory or in db, make new push to addressesArray
								addressesArray.push({_id: from_account_id, transactions: [alltransactions[i]]});
							});
						}
						
						// If to account is already in transactions array, append to entry, else update
						if (addressesArray.some(address => address._id === to_account_id)) {
							// To account exists in transactionsArray
							for (let i = 0; i < addressesArray.length; i++) {
								// Find to account i
								if (addressesArray[i]._id === to_account_id) {
									// Update the array in memory to include the new transaction
									addressesArray[i].transactions = [alltransactions[i], ...addressesArray[i]["transactions"]];
								}
							}
						} else {
							// To account is not found in the existing array in memory
							await addresses.get(to_account_id).then(async to_body => {
								// To account already exists in db, update transactions and push to addressesArray
								addressesArray.push({_id: to_body._id, _rev: to_body._rev, transactions: [alltransactions[i], ...to_body["transactions"]]});
							}).catch(async () => {
								// To account does not exist in memory or in db, make new push to addressesArray
								addressesArray.push({_id: to_account_id, transactions: [alltransactions[i]]});
							});
						}
					}
				}
			}
		}).catch(error => {
			console.log("Exception when bulk adding blocks: " + error);
		});

		increment++; // Increment for async loop functionality
	}

	// Bulk add to blocks database
	blocks.bulk({docs:blocksArray}).then(async () => {
		console.log("Added to blocks");
	}).catch(async error => {
		console.log("Error when bulk adding to blocks db: " + error);
	});

	// Bulk add to transactions database
	transactions.bulk({docs:transactionsArray}).then(async () => {
		console.log("Added to transactions");
	}).catch(async error => {
		console.log("Error when bulk adding to transactions db: " + error);
	});

	console.log(`Bulk added: ${blockNum + 250} of ${currentNum}`);
}

/*
	Add block data to CouchDB (non-bulk, singular)
*/
async function addBlock(blockNum, currentNum) {
	await axios({
		method: 'get',
		url: `${constants.algodurl}/block/${blockNum}`, // Get block information from algod
		headers: {'X-Algo-API-Token': constants.algodapi}
	}).then(async response => {
		blocks.insert(response.data); // Insert block data to blocks database as doc
		let timestamp = response.data.timestamp; // Collect timestamp from block

		if (Object.keys(response.data.txns).length > 0) {
			let alltransactions = response.data.txns.transactions;
			for (let i = 0; i < alltransactions.length; i++) {
				alltransactions[i].timestamp = timestamp; // Add timestamp to transaction (simplify front-end reporting)
				transactions.insert(alltransactions[i]);
				
				/*
				The following code is used to add transactions to the accounts database,
				but is currently disabled until cleanup of the current database and 
				launch to production servers (due to memory usage when conducting operation)
				
				if (typeof alltransactions[i].payment !== 'undefined') {
					let from_account_id = alltransactions[i].from; // From account
					let to_account_id = alltransactions[i].payment.to; // To account

					// Add transaction to from account
					await addresses.get(from_account_id).then(async from_body => {
						// If account exists in db, update the record
						await addresses.insert({_id: from_body._id, _rev: from_body._rev, transactions: [alltransactions[i], ...from_body["transactions"]]});
					}).catch(async () => {
						// If account does not exist in db, create a new record
						await addresses.insert({_id: from_account_id, transactions: [alltransactions[i]]});
					});

					// Add transaction to to account
					await addresses.get(to_account_id).then(async to_body => {
						// If account exists in db, update the record
						await addresses.insert({_id: to_body._id, _rev: to_body._rev, transactions: [alltransactions[i], ...to_body["transactions"]]});
					}).catch(async () => {
						// If account does not exist in db, create a new record
						await addresses.insert({_id: to_account_id, transactions: [alltransactions[i]]});
					});
				}*/
			}
		}
		console.log(`Block added: ${blockNum} of ${currentNum}`); // Log block addition
	}).catch(error => {
		console.log("Exception when adding block to blocks database: " + error);
	})
}

// Run script
updateBlocks();
