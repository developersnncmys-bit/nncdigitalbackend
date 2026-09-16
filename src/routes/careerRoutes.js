const router = require('express').Router();
const c = require('../controllers/careerController');
const { protect } = require('../middleware/auth');

// Public — the website reads open positions.
router.get('/open', c.listOpen);

// Admin — full management.
router.get('/', protect, c.list);
router.post('/', protect, c.create);
router.put('/:id', protect, c.update);
router.delete('/:id', protect, c.remove);

// Public single career (by id or slug) — keep last.
router.get('/:idOrSlug', c.getOne);

module.exports = router;
