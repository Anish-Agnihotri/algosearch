/*
	stats.js
	____________
	Provides stats endpoint.
	________________________
	Return schema:
	{ current_round, reward_rate, max_transactions, avg_block_time }
*/

var constants = require('../global'); // Require global constants
const nano = require("nano")(`http://${constants.dbuser}:${constants.dbpass}@${constants.dbhost}`); // Connect nano to db

// Export Express routes
module.exports = function(app) {

	// --> /stats endpoint
	app.get('/stats', function(req, res) {
		let current_round, reward_rate, avg_block_time, max_transactions; // Declare variables

		// Retrieve latest 100 blocks
		nano.db.use('blocks').list({include_docs: true, descending: true, limit: 100}).then(body => {

			// Current round = latest block's round number
			current_round = parseInt(body.rows[0].doc.round);

			// Reward rate in most recent round = reward rate in latest round
			reward_rate = parseInt(body.rows[0].doc.reward) / 1000000;

			// Average block time
			let timestamp_old = body.rows[99].doc.timestamp; // Timestamp 100 blocks ago
			let timestamp_current = body.rows[0].doc.timestamp; // Timestamp latest block

			 // Timestamp difference / 100 = block time in average seconds
			avg_block_time = (timestamp_current - timestamp_old) / 100;

		}).then(() => {
			// Query info for transactions database
			nano.db.use('transactions').info().then(body => {
				// Max transactions = # of documents in transactionds db
				max_transactions = parseInt(body.doc_count);
			}).then(() => {
				res.send({
					"current_round": current_round,
					"reward_rate": reward_rate,
					"max_transactions": max_transactions,
					"avg_block_time": avg_block_time
				});
			}).catch(error => {
				console.log("Exception when querying for max_transactions: " + error);
			})
		}).catch(error => {
			console.log("Exception when querying for latest 100 blocks (/stats): " + error);
		})
	});
}
