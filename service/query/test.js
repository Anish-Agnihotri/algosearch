var constants = require('../global'); // Require global constants
const nano = require("nano")(`http://${constants.dbuser}:${constants.dbpass}@${constants.dbhost}`); // Connect nano to db
var dbscripts = require('../sync/initSync'); // Require db init scripts

dbscripts.initTransactionsDB();

async function add() {
	for (let i = 501; i < 550; i++) {
		console.log('Adding entry: ' + i);
		await nano.db.use('transactions').insert({
			"type": "pay",
			"tx": "QOOBRVQMX4HW5QZ2EGLQDQCQTKRF3UP3JKDGKYPCXMI6AVV35KQA",
			"from": "GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A",
			"fee": 10000,
			"first-round": 0,
			"last-round": 1000,
			"round": i,
			"payment": {
				"to": "3NVE2MK2QYZQFOZ5XIRQTM7JRHNPUBV7QKLYLT7OO6QXFHXMRIAUXXNCBM",
				"amount": 55500000000,
				"torewards": 0,
				"closerewards": 0
			},
			"fromrewards": 0,
			"genesisID": "testnet-v1.0",
			"genesishashb64": "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI="
		});
	}
}

add();
