const mongoose = require("mongoose");
const password = encodeURIComponent("Dilip@321");
// console.log(password);

const connectDB = () => {
  mongoose
    .connect(
      `MONGO_DB_URI`
    )
    .then((resp) => {
      console.log("Successfully connected to the Database!");
    })
    .catch((err) => console.log(err));
};

module.exports = { connectDB };
