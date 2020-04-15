var constants = require('../global'); // Require global constants
const nano = require("nano")(`http://${constants.dbuser}:${constants.dbpass}@${constants.dbhost}`); // Connect nano to db

async function run() {
        for (let i = 0; i < 200; i++) {
                await nano.db.use('blocks').view('latest', 'latest', {descending: false, limit: 100, include_docs: true}).then(async body => {
                        for (let i = 0; i < body.rows.length; i++) {
							console.log(body.rows[i]);
                                if (body.rows[i].doc.key > 6040000) {
										await nano.db.use('blocks').destroy(body.rows[i].doc._id, body.rows[i].doc._rev).then(async () => {
                                                console.log('Deleted: ' + body.rows[i].doc.key);
                                        }).catch(async error => {
                                                console.log(error);
                                        });
                                } else {
									break;
                                }
                        }
                });
        }
}

async function transactions() {
	for (let i = 0; i < 200; i++) {
		await nano.db.use('transactions').view('latest', 'bytimestamp', {descending: true, limit: 100, include_docs: true}).then(async body => {
			for (let i = 0; i < body.rows.length; i++) {
				if (body.rows[i].doc.round > 6040000) {
					await nano.db.use('transactions').destroy(body.rows[i].id, body.rows[i].doc._rev).then(async () => {
							console.log('Deleted transaction in block: ' + body.rows[i].doc.round);
					}).catch(async error => {
							console.log(error);
					});
				}
			}
		})
	}
}

transactions();
