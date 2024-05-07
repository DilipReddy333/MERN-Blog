const express = require("express");

const postRoute = express.Router();
const verifyUser = require("../verifyUser");
const {
  createPost,
  getPosts,
  deletePost,
  updatePost,
} = require("../controllers/postController");

postRoute.post("/create", verifyUser, createPost);
postRoute.get("/getPosts", getPosts);
postRoute.put("/updatePost/:postId", verifyUser, updatePost);
postRoute.delete("/deletePost", deletePost);

module.exports = postRoute;
