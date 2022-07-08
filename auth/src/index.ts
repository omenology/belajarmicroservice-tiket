import express, { Express } from "express";
import "express-async-errors";
import mongoose from "mongoose";

import { signupRouter } from "./routes";
import { errorHandler } from "./middleware/errorHandlers";
import { ErrorNotFound } from "./utils/customError";

const app: Express = express();

/* Use body parser */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes enrty
app.use(signupRouter);

// route not found
app.all("*", async () => {
  throw new ErrorNotFound();
});

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const start = async () => {
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
