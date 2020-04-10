var constants = require('../global'); // Require global constants
const nano = require("nano")(`http://${constants.dbuser}:${constants.dbpass}@${constants.dbhost}`); // Connect nano to db

module.exports = function(app) {

	app.get('/stats', function(req, res) {
		let current_round, reward_rate, avg_block_time, max_transactions;

		nano.db.use('blocks').list({include_docs: true, descending: true, limit: 100}).then(body => {
			// Current round
			current_round = parseInt(body.rows[0].doc.round);

			// Reward rate in most recent round
			reward_rate = parseInt(body.rows[0].doc.reward) / 1000000;

			// Average block time
			let timestamp_old = body.rows[99].doc.timestamp;
			let timestamp_current = body.rows[0].doc.timestamp;
			console.log(timestamp_old, timestamp_current);
			avg_block_time = (timestamp_current - timestamp_old) / 100;

		}).then(() => {
			nano.db.use('transactions').info().then(body => {
				max_transactions = parseInt(body.doc_count);
			}).then(() => {
				res.send({
					"current_round": current_round,
					"reward_rate": reward_rate,
					"max_transactions": max_transactions,
					"avg_block_time": avg_block_time
				});
			})
		})
	});
}
