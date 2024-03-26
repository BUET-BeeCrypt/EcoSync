require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const dbInit = require("./src/db/init");
const app = express();

app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use(express.json());

// while (true) {
//   console.log("Waiting for db");
//   try {
//     dbInit("./init_ddl.sql");
//     break;
//   } catch (e) {
//     console.log(e);
//   }
// }

app.get("/", (req, res) => {
    res.json({
        message: "API is working"
    });
});

app.use("/api", require("./src/route"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;