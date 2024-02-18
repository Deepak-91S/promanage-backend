const app = require("./index");
const dotenv = require("dotenv").config();
const connectWithDb = require("./config/db");

connectWithDb();

app.listen(process.env.PORT, (req, res) => {
  console.log(`Server is running at ${process.env.PORT}`);
});
