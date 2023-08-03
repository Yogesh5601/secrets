

import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


mongoose
  .connect("mongodb://127.0.0.1:27017/secrets")
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRETE,
  encryptedFields: ["password"],
});

const User = new mongoose.model("User", userSchema);




app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});




app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  newUser
    .save()
    .then(() => {
      res.render("secrets");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username })
    .then((foundUser) => {
      if (foundUser.password === password) {
        res.render("secrets");
      } else {
        res.redirect("/login");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});



app.listen(port, () => {
  console.log(`server running on ${port}`);
});