/*
	Query: addresses.js
	____________
	Addresses endpoint
	____________
	Various Return schemas
*/

var constants = require('../global'); // Require global constants
const axios = require("axios"); // Axios for requests

// Export express routes
module.exports = function(app) {

	// --> Single address data retrieval
	app.get('/addressservice/:address', function(req, res) {
		const address = req.params.address; // Get address from url

		// Request basic account information
		axios({
			method: 'get',
			url: `${constants.algodurl}/account/${address}`, // Request transaction details endpoint
			headers: {'X-Algo-API-Token': constants.algodapi}
		}).then(response => {
			let result = response.data; // Set data to result

			axios({
				method: 'get',
				url: `${constants.algodurl}/account/${address}/transactions?max=25`,
				headers: {'X-Algo-API-Token': constants.algodapi}
			}).then(async resp => {
				let rounds = [];

				for (let i = 0; i < resp.data.transactions.length; i++) {
					rounds.push(resp.data.transactions[i].round);
				}

				let uniqueRounds = [...new Set(rounds)];
				let roundsWithTimestamp = [];
				
				for (let i = 0; i < uniqueRounds.length; i++) {
					await axios({
						method: 'get',
						url: `${constants.algodurl}/block/${uniqueRounds[i]}`,
						headers: {'X-Algo-API-Token': constants.algodapi} 
					}).then(blockresponse => {
						roundsWithTimestamp.push({"round": blockresponse.data.round, "timestamp": blockresponse.data.timestamp});
					}).catch(error => {
						res.status(501);
						console.log("Exception when querying for round timestamp: " + error);
					})
				}

				for (let i = 0; i < resp.data.transactions.length; i++) {
					let round = resp.data.transactions[i].round;
					for (let j = 0; j < roundsWithTimestamp.length; j++) {
						if (roundsWithTimestamp[j].round === round) {
							resp.data.transactions[i].timestamp = roundsWithTimestamp[j].timestamp;
						}
					}
				}

				// Add transactions to result
				result.confirmed_transactions = resp.data.transactions;
				res.send(result);
			}).catch(error => {
				res.status(501);
				console.log("Exception when retrieving address transactions: " + error);
			});
		}).catch(error => {
			res.status(501);
			console.log("Exception when retrieving address information: " + error);
		});
	});
}
