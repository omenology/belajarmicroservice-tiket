import express, { Express, Request, Response, NextFunction } from "express";

import { signupRouter } from "./routes";
import { errorHandler } from "./middleware/errorHandlers";

const app: Express = express();

/* Use body parser */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes enrty
app.use(signupRouter);

// route not found
app.use("*", (req, res) => {
  res.status(404).send("Endpoint Not Found !");
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`app listening on ${PORT} | last restart : ${new Date()}`);
});
