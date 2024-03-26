const router = require('express-promise-router')();
const checkAuth = require('./middlewares/check-auth');

router.use('/auth', require('./api/auth/route'));
router.use('/user', checkAuth, require('./api/user/route')
  /*
  #swagger.tags = ['User']
  #swagger.security = [{
    "bearerAuth": []
  }]
  */
);


module.exports = router;