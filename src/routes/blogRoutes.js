const router = require('express').Router();
const c = require('../controllers/blogController');
const { protect } = require('../middleware/auth');

// Public — the website reads published blogs.
router.get('/published', c.listPublished);

// Admin — full management.
router.get('/', protect, c.list);
router.post('/', protect, c.create);
router.put('/:id', protect, c.update);
router.delete('/:id', protect, c.remove);

// Public single blog (by id or slug) — keep last so it doesn't shadow the above.
router.get('/:idOrSlug', c.getOne);

module.exports = router;
