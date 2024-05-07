const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (
      username.trim().length === 0 ||
      password.trim().length === 0 ||
      email.trim().length === 0
    ) {
      throw new Error("Please fill all the fields");
    }
    const user = await userModel.create({ username, email, password });
    if (user) {
      res.status(200).json({ status: "created", user });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email.trim().length === 0 || password.trim().length === 0) {
      return res.status(400).json({ error: "Please fill all the fields!" });
    }
    const foundUser = await userModel.findOne({ email });
    // console.log(foundUser);
    if (!foundUser) {
      return res.status(400).json({ error: "User not found" });
    }
    if (foundUser.password !== password) {
      return res.status(400).json({ error: "Password is incorrect" });
    }
    // generate a JWT token for the user
    const token = jwt.sign(
      { id: foundUser._id, isAdmin: foundUser.isAdmin },
      "Dilip@321"
    );
    res.status(200).json({ foundUser, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signup,
  signIn,
};
