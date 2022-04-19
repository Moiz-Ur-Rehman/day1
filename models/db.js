const mongoose = require("mongoose");
const connectionDB = mongoose
  .connect("mongodb+srv://moizurrehman:0TUownAPQBCryYY3@cluster0.04rjt.mongodb.net/onlineBookingdb?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("Connection is succesfull with the database");
  })
  .catch((err) => {
    console.log("Error in connecting database",err);
  });

module.exports = connectionDB;