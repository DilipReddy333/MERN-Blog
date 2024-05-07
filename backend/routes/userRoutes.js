const express = require("express");
const {
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const verifyUser = require("../verifyUser");
const userRouter = express.Router();

userRouter.get("/", verifyUser, getAllUsers);
userRouter.put("/update/:userId", verifyUser, updateUser);
userRouter.delete("/delete/:userId", verifyUser, deleteUser);

module.exports = userRouter;
