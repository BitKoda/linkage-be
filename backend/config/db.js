const mongoose = require("mongoose");
const ENV = process.env.NODE_ENV || "development";

const connectDB = async () => {
  try {
    ENV === "test"
      ? (conn = await mongoose.connect(process.env.MONGO_TEST, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          // bufferCommands: false,
        })) &
        console.log(
          `mongoDB TEST connected: ${conn.connection.host}`.cyan.underline
        )
      : (conn = await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })) &
        console.log(
          `mongoDB DEV connected: ${conn.connection.host}`.cyan.underline
        );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
module.exports = connectDB;
