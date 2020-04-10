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

	// Until syncedBlockNumber !== currentRound, retrieve all blocks
	for (syncedBlockNumber; syncedBlockNumber < currentRound; syncedBlockNumber++) {
		await addBlock(syncedBlockNumber, currentRound);
		await sleep(500); // TODO: Remove when live in production
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
		headers: {'x-api-key': constants.algodapi}
	}).then(response => {
		round = response.data.round; // Collect round
	}).catch(error => {
		console.log("Exception when getting current round: " + error);
	})

	return round;
}

/*
	Add block data to CouchDB
*/
async function addBlock(blockNum, currentNum) {
	await axios({
		method: 'get',
		url: `${constants.algodurl}/block/${blockNum}`, // Get block information from algod
		headers: {'x-api-key': constants.algodapi}
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

/* 
	Sleep function to be used only when accessing a rate-limited Algod API.
	Returns a timed promise preventing thread execution.
*/
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Run updateBlocks script
updateBlocks();
