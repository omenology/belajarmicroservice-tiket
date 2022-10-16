import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3000;
const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defind");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URL must be defind");
  try {
    await mongoose.connect(process.env.MONGO_URI, {
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
  console.log("berubah")
};
start();
