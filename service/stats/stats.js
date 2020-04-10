var constants = require('../global'); // Require global constants
const nano = require("nano")(`http://${constants.dbuser}:${constants.dbpass}@${constants.dbhost}`); // Connect nano to db

module.exports = function(app) {

	app.get('/stats', function(req, res) {
		let current_round, maxtransactions;

		nano.db.use('blocks').info().then(body => {
			current_round = parseInt(body.doc_count) - 1;
		}).then(() => {
			nano.db.use('transactions').info().then(body => {
				maxtransactions = parseInt(body.doc_count);
			}).then(() => {
				res.send({
					"current_round": current_round,
					"max_transactions": maxtransactions
				});
			})
		})
	});
}
