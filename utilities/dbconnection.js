const mongoose = require("mongoose");

async function dbconnection() {
  try {
    const db = await mongoose.connect(process.env.db_local);
    if (db) {
      console.log("Database connection successful!".yellow);
    }
  } catch (error) {
    console.log(error.message.red);
  }
}

module.exports = dbconnection;
