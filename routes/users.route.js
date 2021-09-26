const bcrypt = require("bcrypt");
const User = require("../models/users.model");

const express = require("express");
const router = express.Router();

router.get("/", async (req, res)=>{
    const userId = req.query.userId;
    const username = req.query.username;
    try{
        const user = userId ? await User.findById(userId) : await User.findOne({ username: username });
        const { password, updatedAt, isAdmin, ...other } = user._doc;
        res.status(200).send(other);
    }catch(err){
        res.status(500).send(err);
    }
})

router.put("/:id", async(req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        })  
        res.status(200).send({message: "Your Profile is updated"});

    }catch(err){
        res.status(500).send(err);
    }
})

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

router.put("/:id/unfollow", async(req, res)=>{
    if(req.body.userId!== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({ $pull: { followers: req.body.userId} });
                await currentUser.updateOne({ $pull: { followings: req.params.id} });
                res.status(200).send({message:"User has been unfollowed "});
            }else{
                res.status(200).send({message:"You already unfollowed the user"});
            }
        } catch(err){
            res.status(500).send(err);
        }
    } else{
        res.status(403).send({message: "You cannot unfollow yourself"});
    }
})

router.get("/friends/:userId", async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      const friends = await Promise.all(
        user.followings.map((friendId) => {
          return User.findById(friendId);
        })
      );
      let friendList = [];
      friends.map((friend) => {
        const { _id, username, profilePicture } = friend;
        friendList.push({ _id, username, profilePicture });
      });
      res.status(200).json(friendList)
    } catch (err) {
      res.status(500).json(err);
    }
});

router.delete("/:id", async(req, res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).send({message: "User successfully deleted"});
    } catch(err){
        res.status(500).send(err);
    }
})


module.exports = router;