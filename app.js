const express = require('express');
const app = express();

app.use(express.json());

// Connect to database
require('./database/connect');

// Initialize routes
app.use(require('./routes'));

const PORT = process.env.PORT || 21010;
app.listen(PORT, () => {
	console.log(`Server started on port //:${PORT}`);
});