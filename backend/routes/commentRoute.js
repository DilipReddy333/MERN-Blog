const express = require("express");
const {
  createComment,
  getAllComments,
  likeComment,
  deleteComment,
  editComment,
} = require("../controllers/commentController");
const verifyUser = require("../verifyUser");
const commentRouter = express.Router();

commentRouter.post("/:postId", verifyUser, createComment);
commentRouter.get("/:postId", getAllComments);
// commentRouter.get("/get/:commentId", verifyUser, getSingleComment);
commentRouter.put("/:commentId", verifyUser, likeComment);
commentRouter.delete("/:commentId", verifyUser, deleteComment);
commentRouter.put("/edit/:commentId", verifyUser, editComment);
module.exports = commentRouter;
