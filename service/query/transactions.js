/*
	transactions.js
	____________
	Provides transactions endpoint.
	________________________
	Various return schemas
*/

var constants = require('../global'); // Require global constants
const nano = require("nano")(`http://${constants.dbuser}:${constants.dbpass}@${constants.dbhost}`); // Connect nano to db
var axios = require('axios'); // Require axios

// Export app routes
module.exports = function(app) {

	// --> Return single transaction information
	app.get('/transaction/:txid', function(req, res) {
		const txid = req.params.txid; // Get txid from address

		axios({
			method: 'get',
			url: `${constants.algodurl}/transaction/${txid}`, // Request transaction details endpoint
			headers: {'x-api-key': constants.algodapi}
		}).then(response => {
			let result = response.data; // Store response in result

			// Find block number in result, query for block number in blocks db, and return timestamp
			// Workaround to get time transaction occured (not include in API functionality)
			nano.db.use('blocks').list({include_docs: true, skip: result.round, limit: 1}).then(body => {
				result.timestamp = body.rows[0].doc.timestamp; // Add timestamp to result JSON
				res.send(result);
			}).catch(error => {
				res.status(501);
				console.log("Exception when querying blocks database for timestamp: " + error);
			})
		}).catch(error => {
			res.status(501);
			console.log("Exception when getting transaction details " + error);
		})
	});

	// --> Return paginated transaction data
	app.get('/all/transactions/:lastTransaction/:limit/:full', function(req, res) {
		var lastTransaction = parseInt(req.params.lastTransaction); // Pagination handler
		var limit = parseInt(req.params.limit); // Limit (max: 100)
		const showFull = parseInt(req.params.full) === 0 ? false : true; // If 0, truncated data (save bandwidth), else full response

		// If limit > 100, reset to 100.
		if (limit > 100) {
			limit = 100;
		}

		// If limit > lastTransaction, return all
		if (limit > lastTransaction) {
			limit = lastTransaction;
		}

		// Query transactions database (skipping all transactions till lastTransaction), and limiting query to limit items
		nano.db.use('transactions').list({include_docs: true, skip: lastTransaction - limit, limit: limit}).then(body => {
			let transaction = [];

			for (let i = body.rows.length - 1; i >= 0; i--) {
				if (showFull) {
					// If showFull = 1, return all data
					transaction.push(body.rows[i]);
				} else {
					// If showFull = 0, return truncated data (for tables and low bandwidth usage)
					transaction.push({
						"round": body.rows[i].doc.round,
						"type": body.rows[i].doc.type,
						"tx": body.rows[i].doc.tx,
						"from": body.rows[i].doc.from,
						"to": body.rows[i].doc.payment.to,
						"amount": parseInt(body.rows[i].doc.payment.amount)/1000000,
						"fee": parseInt(body.rows[i].doc.fee)/1000000,
					});
				}
			}

			res.send(transaction);
		}).catch(error => {
			res.status(501);
			console.log("Exception when listing all blocks: " + error);
		})
    });
}
