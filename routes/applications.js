const router = require('express').Router();

const ApplicationsService = require('../services/ApplicationsService');
const applicationsService = new ApplicationsService();

const auth = require('../middleware/auth');

router.post('/', (req, res) => {
	applicationsService.createNewApplication(req).subscribe(data => res.json(data));
});

router.put('/:applicationId', auth, (req, res) => {
	applicationsService.editApplication(req).subscribe(data => res.json(data));
});

// Register user to application
router.post('/:applicationId/register', auth, (req, res) => {
	applicationsService.registerUserToApplication(req).subscribe(data => res.json(data));
});

module.exports = router;