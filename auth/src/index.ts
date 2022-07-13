import express, { Express } from "express";
import "express-async-errors";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import routes from "./routes";
import { errorHandler } from "./middleware";
import { ErrorNotFound } from "./utils";

const app: Express = express();
app.set("trust proxy", true);

/* Use body parser */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cookie
app.use(
  cookieSession({
    secure: true,
    signed: false,
  })
);

// routes enrty
app.use(routes);

// route not found
app.all("*", async () => {
  throw new ErrorNotFound();
});

// error handler
app.use(errorHandler);

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
