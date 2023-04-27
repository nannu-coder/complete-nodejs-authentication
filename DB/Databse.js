const mongoose = require("mongoose");

const conectDB = async (url) => {
  try {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (error) {
    console.log(error);
  }
};

module.exports = conectDB;
