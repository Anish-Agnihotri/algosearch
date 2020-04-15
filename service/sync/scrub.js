var constants = require('../global'); // Require global constants
const nano = require("nano")(`http://${constants.dbuser}:${constants.dbpass}@${constants.dbhost}`); // Connect nano to db

async function blocks() {
        for (let i = 0; i < 200; i++) {
                await nano.db.use('blocks').view('latest', 'latest', {descending: true, limit: 100, include_docs: true}).then(async body => {
                        for (let i = 0; i < body.rows.length; i++) {
                                if (body.rows[i].doc.round > 6086500) {
										await nano.db.use('blocks').destroy(body.rows[i].doc._id, body.rows[i].doc._rev).then(async () => {
                                                console.log('Deleted: ' + body.rows[i].doc.round);
                                        }).catch(async error => {
                                                console.log(error);
                                        });
                                } else {
									return;
                                }
                        }
                });
        }
}

async function transactions() {
	for (let i = 0; i < 200; i++) {
		await nano.db.use('transactions').view('latest', 'bytimestamp', {descending: true, limit: 100, include_docs: true}).then(async body => {
			for (let i = 0; i < body.rows.length; i++) {
				if (body.rows[i].doc.round > 6086500) {
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

async function run() {
	await transactions();
}

run();
