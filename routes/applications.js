const router = require('express').Router();

const ApplicationsService = require('../services/ApplicationsService');
const applicationsService = new ApplicationsService();

router.post('/', (req, res) => {
	applicationsService.createNewApplication(req).subscribe(data => res.json(data));
});

module.exports = router;