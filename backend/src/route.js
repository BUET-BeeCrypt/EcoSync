const router = require('express-promise-router')();
const {checkAuth,requiresAdmin} = require('./middlewares/check-auth');


router.use('/auth', require('./api/auth/route'));

router.use(checkAuth);
router.use('/users', require('./api/user/route'));
router.use('/profile', require('./api/user/route-profile'));

router.use(requiresAdmin)
router.use('/rbac', require('./api/rbac/route'));

module.exports = router;