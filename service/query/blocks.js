/*
	Query: blocks.js
	____________
	Blocks endpoint
	____________
	Various Return schemas

	Sample all/blocks:
	{ hash, previousBlockHash, seed, proposer, round, period, txnRoot, reward, rate, frac,
	txns, timestamp, currentProtocol, nextProtocol, nextProtocolApprovals, nextProtocolSwitchOn, 
	upgradePropose, upgradeApprove }
*/

var constants = require('../global'); // Require global constants
const axios = require('axios'); // Axios for requests
const nano = require("nano")(`http://${constants.dbuser}:${constants.dbpass}@${constants.dbhost}`); // Connect nano to db

// Export express routes
module.exports = function(app) {

	// --> Single block data retrieval
	app.get('/blockservice/:blocknumber', function(req, res) {
		const round = parseInt(req.params.blocknumber); // Get round number from request

		// Query blocks database, skipping everything till round number, and limiting to 1 response
		axios({
			method: 'get',
			url: `${constants.algodurl}/blockservice/${round}`, // Request transaction details endpoint
			headers: {'X-Algo-API-Token': constants.algodapi}
		}).then(response => {
			res.send(response.data);
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
		var lastBlock = parseInt(req.params.lastBlock); // lastBlock from query for pagination
		var limit = parseInt(req.params.limit); // limit (max. 100)
		const showFull = parseInt(req.params.full) === 0 ? false : true; // If 0, return truncated. If 1, return full.

		// If limit > 100, reset to 100.
		if (limit > 100) {
			limit = 100;
		}

		// If limit > lastBlock, return all
		if (limit > lastBlock) {
			limit = lastBlock;
		}

		// Query blocks database, skipping all till lastBlock - limit, and limiting to limit
		nano.db.use('blocks').view('latest', 'latest', {include_docs: true, descending: true, skip: lastBlock - limit, limit: limit}).then(body => {
			let blocks = [];
			
			for (let i = body.rows.length - 1; i >= 0; i--) {
				if (showFull) {
					// If showFull = 1, send all data
					blocks.push(body.rows[i]);
				} else {
					// If showFull = 0, send truncated data
					blocks.push({
						"round": body.rows[i].doc.round,
						"transactions": Object.keys(body.rows[i].doc.txns).length,
						"proposer": body.rows[i].doc.proposer,
						"timestamp": body.rows[i].doc.timestamp,
						"reward": parseInt(body.rows[i].doc.reward) / 1000000,
					});
				}
			}

			res.send(blocks.reverse());
		}).catch(error => {
			res.status(501);
			console.log("Exception when listing all blocks: " + error);
		})
    });
}
