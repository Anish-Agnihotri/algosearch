const db = {
	host: '127.0.0.1:5984',
	user: 'admin',
	pass: 'admin'
};

// Initialize sync by creating appropriate database tables
console.log(`http://${db.user}:${db.pass}@${db.host}`);
var nano = require("nano")(`http://${db.user}:${db.pass}@${db.host}`);
nano.db.create("transactions");
nano.db.create("addresses");
nano.db.create("blocks");
