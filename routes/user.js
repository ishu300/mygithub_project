const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");
const requireLogin = require("../middlewares/requireLogin");


// to get user profile
router.get("/user/:id", async (req, res) => {
    try {
        const user = await USER.findOne({ _id: req.params.id }).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const posts = await POST.find({ postedBy: req.params.id })
            .populate("postedBy", "_id")
            .exec();

        res.status(200).json({ user, post: posts || [] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// to follow user
router.put("/follow", requireLogin, async (req, res) => {
    try {
        // Update the user being followed
        const followedUser = await USER.findByIdAndUpdate(
            req.body.followId,
            { $push: { followers: req.user._id } },
            { new: true }
        );

        // Update the current user (follower)
        const followingUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $push: { following: req.body.followId } },
            { new: true }
        );

        res.json({ followedUser, followingUser });
    } catch (err) {
        console.error(err);
        return res.status(422).json({ error: "Error following user" });
    }
});

// to unfollow user
router.put("/unfollow", requireLogin, async (req, res) => {
    try {
        // Update the user being unfollowed
        const unfollowedUser = await USER.findByIdAndUpdate(
            req.body.followId,
            { $pull: { followers: req.user._id } },
            { new: true }
        );

        // Update the current user (unfollower)
        const unfollowingUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: req.body.followId } },
            { new: true }
        );

        res.json({ unfollowedUser, unfollowingUser });
    } catch (err) {
        console.error(err);
        return res.status(422).json({ error: "Error unfollowing user" });
    }
});

// to upload profile pic
router.put("/uploadProfilePic", requireLogin, async (req, res) => {
    try {
        const result = await USER.findByIdAndUpdate(
            req.user._id,
            { $set: { Photo: req.body.pic } },
            { new: true }
        ).exec();

        res.json(result);
    } catch (err) {
        return res.status(422).json({ error: err.message });
    }
});



module.exports = router;