const router = require('express').Router();

const ApplicationsService = require('../services/ApplicationsService');
const applicationsService = new ApplicationsService();

const auth = require('../middleware/auth');

router.post('/', (req, res) => {
	applicationsService.createNewApplication(req).subscribe(data => res.json(data));
});

router.put('/:id', auth, (req, res) => {
	applicationsService.editApplication(req).subscribe(data => res.json(data));
});

module.exports = router;