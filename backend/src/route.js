const router = require('express-promise-router')();
const {checkAuth,requiresAdmin} = require('./middlewares/check-auth');


router.use('/auth', require('./api/auth/route'), /*#swagger.tags = ['Auth']*/);


router.use(checkAuth);
router.use('/users', require('./api/user/route'),  /*#swagger.tags = ['Users']*/);
router.use('/profile', require('./api/user/route-profile', /*#swagger.tags = ['Profile']*/));

router.use('/rbac', requiresAdmin, require('./api/rbac/route'), /*#swagger.tags = ['rbac']*/);

router.use('/sts', require('./api/sts/route'), /*#swagger.tags = ['sts']*/);
router.use('/landfill', require('./api/landfill/route'), /*#swagger.tags = ['landfill']*/);
router.use('/vehicles', require('./api/vehicle/route'), /*#swagger.tags = ['vehicle']*/);
router.use('/contractor', require('./api/contractor/route'), /*#swagger.tags = ['contractor']*/);

router.use('/routes', require('./api/routing/route'), /*#swagger.tags = ['vehicle']*/);

router.use('/stats', require('./api/stat/route'), /*#swagger.tags = ['Stats']*/);

router.use('/community', require('./api/community/route'), /*#swagger.tags = ['Community']*/);



module.exports = router;