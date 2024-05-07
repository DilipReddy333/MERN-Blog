const express = require("express");
const { connectDB } = require("./Database/connectDB");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoute");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/errorMiddleware");
const postRoute = require("./routes/postRoute");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));
connectDB();

app.listen(3000, () => {
  console.log("server listening on the port 3000");
});
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/post", postRoute);

app.use(errorMiddleware);
