import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3000;
const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defind");
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017", {
      auth: {
        username: "root",
        password: "password",
      },
      dbName: "auth",
    });
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`app listening on ${PORT} | last restart : ${new Date()}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
