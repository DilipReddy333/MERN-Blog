const mongoose = require("mongoose");
const password = encodeURIComponent("Dilip@321");
// console.log(password);

const connectDB = () => {
  mongoose
    .connect(
      `mongodb+srv://forlearningsites:aahLpV8dLQ6ow3cK@notesapp.huiv8a8.mongodb.net/mern-blog?retryWrites=true&w=majority&appName=Notesapp`
    )
    .then((resp) => {
      console.log("Successfully connected to the Database!");
    })
    .catch((err) => console.log(err));
};

module.exports = { connectDB };
