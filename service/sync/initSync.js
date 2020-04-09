var constants = require('../global'); // Requiring global constants
var nano = require("nano")(`http://${constants.dbuser}:${constants.dbpass}@${constants.dbhost}`); // Setting up connection to db

/*
	Check for blocks database
	If it exists, continue. Else, create it.
*/
const initBlocksDB = () => {
	console.log("Checking for blocks database");

	nano.db.list().then(body => {
		if (!body.includes('blocks')) {
			console.log("blocks database does not exist, creating...");
			nano.db.create('blocks');
		} else {
			console.log("blocks database exists, continuing...");
		}
	}).catch(error => {
		console.log("Exception when initializing addresses: " + error);
	})
};

/*
	Check for addresses database
	If it exists, continue. Else, create it.
*/
const initAddressesDB = () => {
	console.log("Checking for addresses database");

	nano.db.list().then(body => {
		if (!body.includes('addresses')) {
			console.log("addresses database does not exist, creating...");
			nano.db.create('addresses');
		} else {
			console.log("addresses database exists, continuing...");
		}
	}).catch(error => {
		console.log("Exception when initializing addresses: " + error);
	})
}

/*
	Check for transactions database
	If it exists, continue. Else, create it.
*/
const initTransactionsDB = () => {
	console.log("Checking for transactions database");

	nano.db.list().then(body => {
		if (!body.includes('transactions')) {
			console.log("transactions database does not exist, creating...");
			nano.db.create('transactions');
		} else {
			console.log("transactions database exists, continuing...");
		}
	}).catch(error => {
		console.log("Exception when initializing transactions: " + error);
	})
}

module.exports = {
	initBlocksDB: initBlocksDB,
	initAddressesDB: initAddressesDB,
	initTransactionsDB: initTransactionsDB
};
