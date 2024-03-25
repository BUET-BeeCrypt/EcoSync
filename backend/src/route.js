const router = require('express-promise-router')();

// router.use('/books', require('./book/route'));
router.use('/users', require('./user/route'));
router.use('/profile', require('./user/route-profile'));
router.use('/rbac', require('./rbac/route'));


module.exports = router;