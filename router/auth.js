const express = require("express");
const bcrypt = require("bcryptjs");

require("../db/conn");
const User = require("../schema/userSchema");

// getting all the method from express.Router
const router = express.Router();

// get api
router.get("/", (req, res) => {
  res.send("Home page from Router");
});

// to register on postman, the post api
// router.post ("/register", (req, res) =>{
//    const {name, email, phone, work, password} = req.body;

//    if(!name || !email || !phone || !work || !password) {
//        return res.status(422).json({error: "Plz fill the information properly"})
//    }

//    // findOne method return promises and use to match the data in object
//    User.findOne({email: email})
//    .then((userExist) => {
//        if(userExist) {
//            return res.status(422).json({ error: "Email already exist"})
//        }

//        const user = new User({name, email, phone, work, password});

//        user.save().then(() => {
//            res.status(201).json({message: "user registered successfully"});
//             res.json(req.body)
//        }).catch((error) => {
//            console.log(error)
//        })
//    })

// })

// Post API using Async Await

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, work, password } = req.body;

    if (!name || !email || !phone || !work || !password) {
      return res
        .status(422)
        .json({ error: "Plz fill the information properly" });
    }

    const userExist = await User.findOne({ email: email });
    console.log(userExist);

    if (userExist) {
      return res.status(422).json({ error: "Email already exist" });
    }

    const user = new User({ name, email, phone, work, password });
    // apply here middleware
    console.log("middleware called");
    await user.save();
    console.log("data saved", user);
    res.status(201).json({ message: "user registered successfully" });
  } catch (error) {
    console.log(error);
  }
});

// login Api
router.post("/signin", async (req, res) => {
  try {
    // getting email and password from user side
    const { email, password } = req.body;

    //checking for some value in  email and password
    if (!email || !password) {
      return res.status(400).json({ error: "Plx fill all tha data" });
    }
    //trying to get user information from our database
    const userLogin = await User.findOne({ email: email });
    console.log(userLogin);

    // checking for email that email is exist in our database or not
    if (!userLogin) {
      return res.json({ error: "Email or password is Invalid" });
    }

    //comparing the password from the client side andpassword stored in database
    const isMatch = await bcrypt.compare(password, userLogin.password);
    const token = userLogin.generateAuthToken();
    console.log(token)
    res.cookie('jwtoken', token, {
        expires: new Date(Date.now() + 30000000000),
        httpOnly: true
    })

    // checking thepasswordthat password is correct or not
    if (!isMatch) {
      res.status(400).json({ error: "Email or password is incorrect" });
    } else {
      return res.json({ message: "user signin successfully" });
    }

    console.log(userLogin);
    // res.json({ message: "user login successfull" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
