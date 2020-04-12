const router = require('express').Router();
const { version, author, repository, license } = require('../package.json');

router.get('/', (req, res) => {
	res.json({
		message: "Welcome to UUS Microservice",
		version,
		license,
		author,
		repository
	});
});

// Users routes
router.use('/', require('./users'));

module.exports = router;