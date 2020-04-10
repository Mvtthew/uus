const express = require('express');
const app = express();

// Initialize routes
app.use(require('./routes'));

const PORT = process.env.PORT || 21010;
app.listen(PORT, () => {
	console.log(`Server started on port //:${PORT}`);
});