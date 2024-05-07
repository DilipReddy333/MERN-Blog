const express = require("express");
const { signup, signIn } = require("../controllers/authController");

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signIn);

module.exports = authRouter;
