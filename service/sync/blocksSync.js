/*
	blockSync.js
	____________
	Syncs current round with blocks database.
	TODO: Error handling
	TODO: Speed limiting
*/

var constants = require('../global'); // Require global constants
var dbscripts = require('./initSync'); // Require db init scripts
const axios = require('axios'); // Require axios for requests
const nano = require("nano")(`http://${constants.dbuser}:${constants.dbpass}@${constants.dbhost}`); // Connect nano to db

dbscripts.initBlocksDB(); // Check if blocks db exists, else, create it.
let blocks = nano.db.use('blocks'); // Connect to blocks db

async function updateBlocks() {
	// syncedBlockNumber = head round in db
	// currentRound = head round from algod
	let syncedBlockNumber, currentRound;
	
	nano.db.get('blocks').then((body) => {
		syncedBlockNumber = body.doc_count; // Get current db synced block
	})

	currentRound = await getCurrentRound(); // Get latest round

	setInterval(async() => {
		currentRound = await getCurrentRound(); // Get new latest round every half second
	}, 500);

	for (syncedBlockNumber; syncedBlockNumber < currentRound; syncedBlockNumber++) {
		await addBlock(syncedBlockNumber, currentRound);
		await sleep(250);
	}

	setInterval(() => {
		updateBlocks();
	}, 1000);
}

async function getCurrentRound() {
	let data;
	
	await axios({
		method: 'get',
		url: `${constants.algodurl}/ledger/supply`,
		headers: {'x-api-key': constants.algodapi}
	}).then(response => {
		//console.log(`Updated current round: ${response.data.round}`);
		data = response.data.round;
	})

	return data;
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function addBlock(blockNum, currentNum) {
	await axios({
		method: 'get',
		url: `${constants.algodurl}/block/${blockNum}`,
		headers: {'x-api-key': constants.algodapi}
	}).then(response => {
		console.log(`Block added: ${blockNum} of ${currentNum}`);
		blocks.insert(response.data);
	})
}

updateBlocks();
