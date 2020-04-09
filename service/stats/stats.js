var constants = require('../global'); // Require global constants
const nano = require("nano")(`http://${constants.dbuser}:${constants.dbpass}@${constants.dbhost}`); // Connect nano to db

module.exports = function(app) {
	app.get('/stats', function(req, res) {
		nano.db.use('blocks').info().then(body => {
			res.send({"current_round": parseInt(body.doc_count) - 1});
		});
	});
}
