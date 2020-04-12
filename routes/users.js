const router = require('express').Router();

const UserService = require('../services/UsersService');
const userService = new UserService;

router.post('/register', (req, res) => {
	userService.registerUser(req).subscribe(data => res.json(data));
});

router.post('/token', (req, res) => {
	userService.createUserToken(req).subscribe(data => res.json(data));
});

router.post('/checktoken', (req, res) => {
	userService.checkToken(req).subscribe(data => res.json(data));
});

module.exports = router;