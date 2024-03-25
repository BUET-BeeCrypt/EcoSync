const router = require('express-promise-router')();
const checkAuth = require('./middlewares/check-auth');

// router.use('/books', require('./book/route'));
router.use('/auth', require('./api/auth/route'));
router.use('/user', checkAuth, require('./api/user/route'));

module.exports = router;