const express = require("express");
const cors = require("cors");

const app = express();
const port = 8000;

app.use(cors());

require('./service/query/blocks')(app);
require('./service/query/transactions')(app);
require('./service/stats/stats')(app);

app.listen(port);
