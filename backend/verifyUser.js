const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  // console.log(accessToken);
  if (!accessToken) {
    return res.status(404).json("No JWT token");
  }
  const userDetails = jwt.verify(accessToken, "Dilip@321");
  //   console.log(userDetails);
  req.user = userDetails;
  next();
};

module.exports = verifyUser;
