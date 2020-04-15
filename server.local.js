const express = require("express"); // Import express for simplified routing
const cors = require("cors"); // Setup cors for cross-origin requests for all routes
const compression = require("compression");

const app = express(); // Setup express 
const port = 8000; // Setup port 8000 for Express server

app.use(cors()); // Enable cors
app.use(compression());

// --> /blockservice/:blocknumber
// --> /all/blocks/:lastBlock/:limit/:full (paginated)
require('./service/query/blocks')(app);

// --> /transactionservice/:txid
// --> /all/transactions/:lastTransaction/:limit/:full (paginated)
// --> /all/addresstx/:address
require('./service/query/transactions')(app);

// --> /address/:address
require('./service/query/addresses')(app);

// --> /stats
require('./service/stats/stats')(app);

app.listen(port); // Initialize server
