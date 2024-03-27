const router = require('express-promise-router')();
const {checkAuth,requiresAdmin} = require('./middlewares/check-auth');


router.use('/auth', require('./api/auth/route'), /*#swagger.tags = ['Auth']*/);


router.use(checkAuth);
router.use('/users', require('./api/user/route'),  /*#swagger.tags = ['Users']*/);
router.use('/profile', require('./api/user/route-profile', /*#swagger.tags = ['Profile']*/));

router.use(requiresAdmin)
router.use('/rbac', require('./api/rbac/route'), /*#swagger.tags = ['rbac']*/);

router.use('/sts', require('./api/sts/route'), /*#swagger.tags = ['sts']*/);
router.use('/landfill', require('./api/landfill/route'), /*#swagger.tags = ['landfill']*/);

module.exports = router;