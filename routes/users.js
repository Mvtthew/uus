const router = require('express').Router();

const UserService = require('../services/UsersService');
const userService = new UserService;

router.post('/', (req, res) => {
	userService.registerUser();
});

module.exports = router;