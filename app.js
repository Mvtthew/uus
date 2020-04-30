const express = require('express');
const cors = require('cors');
const expressFileupload = require('express-fileupload');
const colors = require('colors');
const app = express();

// Cors (*)
app.use(cors());

// Body parsers
app.use(express.json());
app.use(expressFileupload());

// Connect to database
require('./database/connect');

// Initialize routes
app.use(require('./routes'));

const PORT = process.env.PORT || 7070;
app.listen(PORT, () => {
	console.log(`UUS Server started on port //:${colors.bgCyan(PORT)}`);
});