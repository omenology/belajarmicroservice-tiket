import express, { Express } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { errorHandler, ErrorNotFound } from "@omnlgy/common";
import router from "./routes";

const app: Express = express();
app.set("trust proxy", true);

/* Use body parser */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cookie config
app.use(
  cookieSession({
    secure: process.env.NODE_ENV !== "test",
    signed: false,
  })
);

// routes enrty
app.use(router);

// route not found
app.all("*", async () => {
  throw new ErrorNotFound();
});

app.use(errorHandler);

export default app;
