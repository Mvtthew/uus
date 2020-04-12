const express = require('express');
const router = express.Router();

const UserService = require('../services/UsersService');
const userService = new UserService;

const auth = require('../middleware/auth');

// User control endpoints
router.post('/', (req, res) => {
	userService.registerUser(req).subscribe(data => res.json(data));
});

router.post('/token', (req, res) => {
	userService.createUserToken(req).subscribe(data => res.json(data));
});

router.post('/checktoken', (req, res) => {
	userService.checkToken(req).subscribe(data => res.json(data));
});

router.delete('/me', auth, (req, res) => {
	// First remove user image if he have so
	userService.removeUserImage(req).subscribe(() => {
		// Then remove user entity
		userService.deleteUser(req).subscribe(data => res.json(data));
	});
});


// Profile image endpoints
router.post('/image', auth, (req, res) => {
	userService.addUserImage(req).subscribe(data => res.json(data));
});

router.delete('/image', auth, (req, res) => {
	userService.removeUserImage(req).subscribe(data => res.json(data));
});
// Endpoint serving user images
router.use('/i', express.static('store/profile-images'));

module.exports = router;