const app = require("./index");
const dotenv = require("dotenv").config();
const connectWithDb = require("./config/db");

connectWithDb();

const User = require("./model/user");

const user = User.create({
  name: "mouli",
  email: "abc@gmail.com",
  password: "123456",
}).then((a) => {
  console.log(a);
});

app.listen(process.env.PORT, (req, res) => {
  console.log(`Server is running at ${process.env.PORT}`);
});
