const { addBook, editBook, getBook, getBooks } = require("./controller");
const { body, validationResult } = require("express-validator");

const router = require("express-promise-router")();

const validateSchema = (req, res, next) => {
  const validationRules = [
    body("id").isInt().withMessage("id must be an integer"),
    body("title").isString().withMessage("title must be a string"),
    body("title").notEmpty().withMessage("title cannot be empty"),
    body("author").isString().withMessage("author must be a string"),
    body("genere").isString().withMessage("genere must be a string"),
    body("price").isNumeric().withMessage("price must be a number"),
    // positive price
    body("price").custom((value) => {
      if (value < 0) {
        throw new Error("price must be a positive number");
      }
      return true;
    }),
  ];

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

router.get("/", getBooks);
router.get("/:id", getBook);
router.post("/", validateSchema, addBook);
router.put("/:id", validateSchema, editBook);

module.exports = router;
