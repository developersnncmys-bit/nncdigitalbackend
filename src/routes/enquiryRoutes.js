const router = require('express').Router();
const { createWebsiteEnquiry } = require('../controllers/enquiryController');

// PUBLIC — no auth. This is the endpoint the website form posts to.
router.post('/', createWebsiteEnquiry);

module.exports = router;
