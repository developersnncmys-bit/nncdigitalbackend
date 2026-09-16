const router = require('express').Router();
const c = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/auth');

// Only admins may manage users.
router.use(protect, restrictTo('admin'));

router.get('/', c.list);
router.post('/', c.create);
router.get('/:id', c.getOne);
router.put('/:id', c.update);
router.delete('/:id', c.remove);

module.exports = router;
