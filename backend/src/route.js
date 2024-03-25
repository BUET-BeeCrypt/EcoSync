const router = require('express-promise-router')();

// router.use('/books', require('./book/route'));
router.use('/users', require('./user/route'));
router.use('/wallets', require('./user/route-wallet'));
router.use('/stations', require('./station/route'));
router.use('/trains', require('./train/route'));
router.use('/tickets', require('./ticket/route'));
router.use('/routes', require('./route/route'));

module.exports = router;