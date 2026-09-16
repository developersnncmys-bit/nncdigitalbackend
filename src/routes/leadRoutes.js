const router = require('express').Router();
const c = require('../controllers/leadController');
const { protect } = require('../middleware/auth');

// All lead routes require a logged-in user.
router.use(protect);

router.get('/', c.list);
router.get('/stats', c.stats);
router.post('/', c.create);
router.get('/:id', c.getOne);
router.put('/:id', c.update);
router.delete('/:id', c.remove);
router.post('/:id/notes', c.addNote);

module.exports = router;
