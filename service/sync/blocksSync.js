/*
	blockSync.js
	____________
	Syncs current round with blocks database.
*/
var constants = require('../global');

const axios = require('axios');
const nano = require("nano")(`http://${constants.dbuser}:${constants.dbpass}@${constants.dbhost}`);

const blocks = nano.db.use("blocks");

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

async function updateBlocks() {
	let syncedBlockNumber = 0;

	nano.db.get('blocks').then((body) => {
		syncedBlockNumber = body.doc_count;
	})

	let currentRound = await getCurrentRound();

	setInterval(async() => {
		currentRound = await getCurrentRound();
	}, 500);

	for (syncedBlockNumber; syncedBlockNumber < currentRound; syncedBlockNumber++) {
		await addBlock(syncedBlockNumber, currentRound);
		await sleep(250);
	}
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
