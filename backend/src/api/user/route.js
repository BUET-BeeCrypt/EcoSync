const controller = require("./controller");
const router = require("express-promise-router")();

router.get("/test", (req, res) => {
  res.json({ message: "This is secured user route" });
});
router.post("/", controller.addUser);


module.exports = router;