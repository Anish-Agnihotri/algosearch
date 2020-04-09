var constants = require('../global'); // Require global constants
const nano = require("nano")(`http://${constants.dbuser}:${constants.dbpass}@${constants.dbhost}`); // Connect nano to db
let blocks = nano.db.use('blocks'); // Connect to blocks db

function test() {
	blocks.info().then(body => {
		console.log(body.doc_count);
	})
}

test();
