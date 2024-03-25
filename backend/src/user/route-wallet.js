const controller = require("./controller");
const router = require("express-promise-router")();

router.get("/:wallet_id", controller.getWallet);
router.put("/:wallet_id", controller.addWalletBalance);

module.exports = router;
