const router = require('express').Router();

router.use('/auth', require('./authRoutes'));
router.use('/leads', require('./leadRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/blogs', require('./blogRoutes'));
router.use('/careers', require('./careerRoutes'));
router.use('/website-enquiry', require('./enquiryRoutes'));

router.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

module.exports = router;
