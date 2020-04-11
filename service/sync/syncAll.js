/*
	syncAll.js
	____________
	Syncs current round with blocks and transactions database.
*/

var constants = require('../global'); // Require global constants
var dbscripts = require('./initSync'); // Require db init scripts
const axios = require('axios'); // Require axios for requests
const nano = require("nano")(`http://${constants.dbuser}:${constants.dbpass}@${constants.dbhost}`); // Connect nano to db

dbscripts.initBlocksDB(); // Check if blocks db exists, else, create it.
dbscripts.initTransactionsDB(); // Check if transactions db exists, else, create it.
let blocks = nano.db.use('blocks'); // Connect to blocks db
let transactions = nano.db.use('transactions'); // Connect to transactions db

/*
	Update blocks in database based on
	current block in db and highest existing block from blockchain
*/
async function updateBlocks() {
	// syncedBlockNumber = head round in db
	// currentRound = head round from algod
	let syncedBlockNumber, currentRound;
	
	nano.db.get('blocks').then((body) => {
		syncedBlockNumber = body.doc_count; // Get current db synced block
	}).catch(error => {
		console.log('Exception when retrieving synced block number: ' + error);
	})

	currentRound = await getCurrentRound(); // Get latest round

	setInterval(async() => {
		currentRound = await getCurrentRound(); // Get new latest round every half second
	}, 500);

	// If there are more than 250 blocks to sync
	if (syncedBlockNumber + 250 < currentRound) {
		do {
			// FIXME: Fix the variable positioning; works for now
			// eslint-disable-next-line no-loop-func
			await bulkAddBlocks(syncedBlockNumber, currentRound).then(() => {
				syncedBlockNumber += 250; // Add 250 blocks, and increment the synced number
			}).catch(error => {
				console.log("Error when incrementing syncedBlockNumber during bulk block addition: " + error);
			});
		} while (currentRound - 250 > syncedBlockNumber);
	} else {
		// If there are less than 250 blocks to sync
		do {
			// FIXME: Fix the variable positioning; works for now
			// eslint-disable-next-line no-loop-func
			await addBlock(syncedBlockNumber, currentRound).then(() => {
				syncedBlockNumber++; // Add blocks one-by-one, and increment the synced number
			}).catch(error => {
				console.log("Error when incrementing syncedBlockNumber during single block addition: " + error);
			});
		} while (syncedBlockNumber < currentRound && syncedBlockNumber + 250 > currentRound);
	}

	// Once syncedBlockNumber === currentRound, run updateBlocks() once every second.
	setInterval(() => {
		updateBlocks(); // Self update call
	}, 1000);
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
	let increment = 0; // for async loop functionality
	
	while (increment < 250) {
		await axios({
			method: 'get',
			url: `${constants.algodurl}/block/${blockNum + increment}`, // Retrieve each block in succession
			headers: {'X-Algo-API-Token': constants.algodapi}
		}).then(response => {
			blocksArray.push(response.data); // Push block to array
			if (Object.keys(response.data.txns).length > 0) {
				let alltransactions = response.data.txns.transactions;
				for (let i = 0; i < alltransactions.length; i++) {
					transactionsArray.push(alltransactions[i]); // Push transaction to transactionsArray
				}
			}
		}).catch(error => {
			console.log("Exception when bulk adding blocks: " + error);
		});
	}

	blocks.bulk({docs:blocksArray}); // Bulk add to blocks database
	transactions.bulk({docs:transactionsArray}); // Bulk add to transactions database
	console.log(`Bulk added: ${blockNum + 250} of ${currentNum}`);
}

/*
	Add block data to CouchDB
*/
async function addBlock(blockNum, currentNum) {
	await axios({
		method: 'get',
		url: `${constants.algodurl}/block/${blockNum}`, // Get block information from algod
		headers: {'X-Algo-API-Token': constants.algodapi}
	}).then(async response => {
		blocks.insert(response.data); // Insert block data to blocks database as doc
		if (Object.keys(response.data.txns).length > 0) {
			let alltransactions = response.data.txns.transactions;
			for (let i = 0; i < alltransactions.length; i++) {
				transactions.insert(alltransactions[i]);
			}
		}
		console.log(`Block added: ${blockNum} of ${currentNum}`); // Log block addition
	}).catch(error => {
		console.log("Exception when adding block to blocks database: " + error);
	})
}

// Run updateBlocks script
updateBlocks();
