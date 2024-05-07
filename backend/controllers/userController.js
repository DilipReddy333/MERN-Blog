const userModel = require("../Models/userModel");

const getAllUsers = async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(403).json({ message: "You are not an Admin to view all users" });
  }
  try {
    const startIndex = req.query.startIndex || 0;
    const limit = req.query.limit || 6;
    const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;
    const allUsers = await userModel
      .find({})
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: sortDirection });
    const allUsersLength = await userModel.countDocuments();
    const now = new Date();
    const lastMonthDate = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await userModel.countDocuments({
      createdAt: { $gte: lastMonthDate },
    });
    const usersWithoutPassword = allUsers.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    return res
      .status(200)
      .json({ users: usersWithoutPassword, lastMonthUsers, allUsersLength });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  // console.log(req.body);
  // console.log(req.user);
  if (userId !== req?.user?.id) {
    return res.status(404).json("You are not allowed to update this user!");
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return res.status(400).json("Password must be atleast 6 characters!");
    }
  }
  if (req.body.username) {
    req.body.username = req.body.username.replace(/\s+/g, "");
  }
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        },
      },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!req.user.isAdmin && userId !== req.user.id) {
      return res.status(404).json({ message: "User ID mismatch" });
    }
    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (deletedUser) {
      res.status(200).json(deletedUser);
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};
module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
};
