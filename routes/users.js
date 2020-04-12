const router = require('express').Router();

const UserService = require('../services/UsersService');
const userService = new UserService;

router.post('/', (req, res) => {
	userService.registerUser(req.body).subscribe(data => res.json(data));
});

module.exports = router;