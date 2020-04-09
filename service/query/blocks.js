/*
	Query: blocks.js
	____________
	Blocks endpoint
	____________
	Return schema:
	{ hash, previousBlockHash, seed, proposer, round, period, txnRoot, reward, rate, frac,
	txns, timestamp, currentProtocol, nextProtocol, nextProtocolApprovals, nextProtocolSwitchOn, 
	upgradePropose, upgradeApprove }
*/
var constants = require('../global'); // Require global constants
const nano = require("nano")(`http://${constants.dbuser}:${constants.dbpass}@${constants.dbhost}`); // Connect nano to db

module.exports = function(app) {

	app.get('/block/:blocknumber', function(req, res) {
		const round = parseInt(req.params.blocknumber);
		nano.db.use('blocks').list({include_docs: true, skip: round, limit: 1}).then(body => {
			res.send(body.rows[0].doc);
		}).catch(error => {
			res.status(501);
			console.log(`Exception when retrieving block number ${round}: ${error}`);
		})
	});
	/*
		Block information endpoint
		:lastBlock = last block to pull from
		:limit = maximum 100 records retrieved
		:full = if 0, return truncated data, else return full data
	*/
    app.get('/all/blocks/:lastBlock/:limit/:full', function(req, res) {
		var lastBlock = parseInt(req.params.lastBlock);
		var limit = parseInt(req.params.limit);
		const showFull = parseInt(req.params.full) === 0 ? false : true;

		// If limit > 100, reset to 100.
		if (limit > 100) {
			limit = 100;
		}

		// If limit > lastBlock, return all
		if (limit > lastBlock) {
			limit = lastBlock;
		}

		nano.db.use('blocks').list({include_docs: true, skip: lastBlock - limit, limit: limit}).then(body => {
			let blocks = [];
			for (let i = body.rows.length - 1; i >= 0; i--) {
				if (showFull) {
					blocks.push(body.rows[i]);
				} else {
					blocks.push({
						"round": body.rows[i].doc.round,
						"transactions": Object.keys(body.rows[i].doc.txns).length,
						"proposer": body.rows[i].doc.proposer,
						"timestamp": body.rows[i].doc.timestamp,
					});
				}
			}
			res.send(blocks);
		}).catch(error => {
			res.status(501);
			console.log("Exception when listing all blocks: " + error);
		})
    });

}
