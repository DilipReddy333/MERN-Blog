const commentModel = require("../Models/commentModel");

const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    if (req.body.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not the user to comment!" });
    }
    const newComment = await commentModel.create({
      comment: req.body.comment,
      postId: postId,
      userId: req.body.userId,
    });
    if (newComment) {
      const createdComment = await commentModel
        .findById({ _id: newComment._id })
        .populate("userId", "-password");
      if (createdComment) {
        res.status(200).json({ createdComment });
      }
    }
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
};

const getAllComments = async (req, res) => {
  const { postId } = req.params;
  // console.log(postId);
  try {
    const allComments = await commentModel
      .find({ postId })
      .populate("userId", "-password")
      .sort({ createdAt: -1 });
    if (allComments) {
      // console.log(allComments);
      res.status(200).json(allComments);
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await commentModel.findById({ _id: commentId });
    if (!comment) {
      return res.status(403).json("No comment found!");
    }
    if (comment) {
      const userIndex = comment.likes.indexOf(req.user.id);
      if (userIndex === -1) {
        //user not liked yet
        comment.numberOfLikes += 1;
        comment.likes.push(req.user.id);
      } else {
        comment.numberOfLikes -= 1;
        comment.likes.splice(userIndex, 1);
      }
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

// const getSingleComment = async (req, res) => {
//   try {
//     const { commentId } = req.params;
//     const comment = await commentModel.findById({ _id: commentId });
//     // console.log(comment);
//     console.log(req.user);
//     if (comment.userId === req.user.id || req.user.isAdmin) {
//       return res.status(200).json(comment);
//     } else {
//       return res
//         .status(403)
//         .json({ message: "You are not the author to get the comment" });
//     }
//   } catch (error) {
//     res.status(403).json({ message: error.message });
//   }
// };

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const foundComment = await commentModel.findById({ _id: commentId });
    // console.log(req.user);
    // console.log(foundComment);
    if (
      String(foundComment.userId) === String(req.user.id) ||
      req.user.isAdmin
    ) {
      // proceed to delete
      const deletedComment = await commentModel.findByIdAndDelete({
        _id: commentId,
      });
      if (deletedComment) {
        return res.status(200).json(deletedComment);
      }
    } else {
      return res.status(403).json({
        message: "You are not the comment author to delete the comment!",
      });
    }
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
};
const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const commentToEdit = await commentModel.findById({ _id: commentId });
    if (commentToEdit) {
      if (
        String(commentToEdit.userId) === String(req.user.id) ||
        req.user.isAdmin
      ) {
        // proceed to edit
        const comment = await commentModel.findByIdAndUpdate(
          commentId,
          {
            $set: {
              comment: req.body.comment,
            },
          },
          { new: true }
        );
        if (comment) {
          res.status(200).json(comment);
        }
      } else {
        return res
          .status(403)
          .json({ message: "You are not the author to Edit" });
      }
    } else {
      return res.status(403).json({ message: "Invalid comment Id" });
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getAllComments,
  likeComment,
  deleteComment,
  editComment,
};
