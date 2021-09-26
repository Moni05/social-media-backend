const User = require("../models/users.model");
const bcrypt = require("bcrypt");

const express = require("express");
const router = express.Router();



router.post("/register", async(req, res)=>{

    try{

        const salt = await bcrypt.genSalt(7);
        req.body.password = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        })

        const user = await newUser.save();
        res.status(200).send(user);

    }catch(err){
        res.status(500).send(err);
    }

})

router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      !user && res.status(404).json("user not found");
  
      const validPassword = await bcrypt.compare(req.body.password, user.password)
      !validPassword && res.status(400).json("wrong password")
  
      res.status(200).json(user)
    } catch (err) {
      res.status(500).json(err)
    }
  });

module.exports = router;