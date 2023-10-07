const mongoose = require("mongoose");
const DB_CONNECTION_URL = "mongodb://127.0.0.1:27017/test";


const connectDB = () => {
  const options = {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  return mongoose.connect(DB_CONNECTION_URL, options);
};

module.exports = connectDB;
