const router = require('express-promise-router')();
const checkAuth = require('./middlewares/check-auth');


router.use('/auth', require('./api/auth/route'));
router.use(checkAuth);
router.use('/users', require('./user/route'));
router.use('/profile', require('./user/route-profile'));
router.use('/rbac', require('./rbac/route'));

module.exports = router;