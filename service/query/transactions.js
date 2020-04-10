var constants = require('../global'); // Require global constants
const nano = require("nano")(`http://${constants.dbuser}:${constants.dbpass}@${constants.dbhost}`); // Connect nano to db

module.exports = function(app) {
	app.get('/all/transactions/:lastTransaction/:limit/:full', function(req, res) {
		var lastTransaction = parseInt(req.params.lastTransaction);
		var limit = parseInt(req.params.limit);
		const showFull = parseInt(req.params.full) === 0 ? false : true;

		// If limit > 100, reset to 100.
		if (limit > 100) {
			limit = 100;
		}

		// If limit > lastTransaction, return all
		if (limit > lastTransaction) {
			limit = lastTransaction;
		}

		nano.db.use('transactions').list({include_docs: true, skip: lastTransaction - limit, limit: limit}).then(body => {
			let transaction = [];
			for (let i = body.rows.length - 1; i >= 0; i--) {
				if (showFull) {
					transaction.push(body.rows[i]);
				} else {
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
