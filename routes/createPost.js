const express = require("express");
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const router =  express.Router();
const POST = mongoose.model("POST")

//Route

router.get("/allposts", requireLogin,(req,res)=>{
    POST.find()
    .populate("postedBy" , "_id name Photo")
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt")
    .then(posts=>res.json(posts))
    .catch(err=> console.log(err))
})


router.post("/createPost", requireLogin, (req,res)=>{
    const {body,pic}=req.body;
    if(!body || !pic){
        return res.status(422).json({error:"please add all the fields"})
    }
    req.user
    const post = new POST({
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then((result)=>{
        return res.json({post:result})
    }).catch(err => console.log(err))
})

router.get("/myposts" ,requireLogin, (req,res)=>{
   POST.find( { postedBy:req.user._id })
   .populate("postedBy" , "_id name")
   .sort("-createdAt")
   .populate("comments.postedBy", "_id name")
   .then(myposts=>{
    res.json(myposts)
   })
})

router.put("/like", requireLogin, async (req, res) => {
    try {
      const result = await POST.findByIdAndUpdate(
        req.body.postId,
        {
          $push: { likes: req.user._id },
        },
        {
          new: true,
        }
      )
        .populate("postedBy", "_id name Photo")
        .exec();
  
      res.json(result);
    } catch (err) {
      res.status(422).json({ error: err });
    }
  });

  router.put("/unlike", requireLogin, async (req, res) => {
    try {
      const result = await POST.findByIdAndUpdate(
        req.body.postId,
        {
          $pull: { likes: req.user._id },
        },
        {
          new: true,
        }
      )
        .populate("postedBy", "_id name Photo")
        .exec();
  
      res.json(result);
    } catch (err) {
      res.status(422).json({ error: err });
    }
  });
  

router.put("/comment", requireLogin, async (req, res) => {
    const comment = {
      comment: req.body.text,
      postedBy: req.user._id,
    };
  
    try {
      const result = await POST.findByIdAndUpdate(
        req.body.postId,
        {
          $push: { comments: comment },
        },
        {
          new: true,
        }
      ).populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name Photo")
      .exec();
  
      res.json(result);
    } catch (err) {
      res.status(422).json({ error: err });
    }
  });

  // Api to delete post
  router.delete("/deletePost/:postId", requireLogin, async (req, res) => {
    try {
        const post = await POST.findOne({ _id: req.params.postId })
            .populate("postedBy", "_id")
            .exec();

        if (!post) {
            return res.status(422).json({ error: "Post not found" });
        }

        if (post.postedBy._id.toString() === req.user._id.toString()) {
            await POST.deleteOne({ _id: req.params.postId });
            return res.json({ message: "Successfully deleted" });
        } else {
            return res.status(403).json({ error: "Unauthorized: You can only delete your own posts" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// to show following post
router.get("/myfollowingpost", requireLogin, (req, res) => {
  POST.find({ postedBy: { $in: req.user.following } })
      .populate("postedBy", "_id name Photo")
      .populate("comments.postedBy", "_id name")
      .then(posts => {
          res.json(posts)
      })
      .catch(err => { console.log(err) })
})

// Api for bio
router.put("/updateBio", requireLogin, async (req, res) => {
  const { bio } = req.body;

  console.log("Received bio update request:", bio);

  try {
    // Find the user by ID and update the bio
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { bio } },
      { new: true }
    );

    res.json({ bio: updatedUser.bio });
  } catch (error) {
    console.error("Error updating bio:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router