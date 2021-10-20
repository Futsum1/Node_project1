const dotenv = require("dotenv");

const express = require("express");
const app = express();

dotenv.config({
  path: "./config.env",
});

const port = process.env.PORT;
app.use(express.json());
require("./db/conn");

app.use(require("./router/auth"));

// const user = require('user');

const name = (req, res, next) => {
  console.log("This is Middle wear");

  next();
};

app.get("/", (req, res) => {
  res.send("Hello from Futsum");
});

app.get("/contact", name, (req, res) => {
  console.log("This is Contact page");
  res.send("Welcome to contact page");
});

app.get("/about", (req, res) => {
  res.send("welcome to about page");
});

app.listen(port, () => {
  console.log(`server is running at port no ${port}`);
});
