const express = require('express');
const colors = require('colors');
const app = express();

app.use(express.json());

// Connect to database
require('./database/connect');

// Initialize routes
app.use(require('./routes'));

const PORT = process.env.PORT || 7070;
app.listen(PORT, () => {
	console.log(`UUS Server started on port //:${colors.bgCyan(PORT)}`);
});