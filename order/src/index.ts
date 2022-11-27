import app from "./app";
import mongoose from "mongoose";
import { natsClient } from "./utils/NatsClient";
import { TicketCreatedListener } from "./events/listeners/TicketCreatedListener";
import { TicketUpdatedListener } from "./events/listeners/TicketUpdatedListener";

const PORT = process.env.PORT || 3000;
const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defind");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URL must be defind");
  if (!process.env.NATS_CLUSTER_ID) throw new Error("NATS_CLUSTER_ID must be defind");
  if (!process.env.NATS_CLIENT_ID) throw new Error("NATS_CLIENT_ID must be defind");
  if (!process.env.NATS_URL) throw new Error("MONGO_URL must be defind");
  
  try {
    await natsClient.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
    natsClient.stan.on("close", () => {
      console.log("NATS connection close");
      process.exit();
    });

    process.on("SIGINT", () => {
      natsClient.stan.close();
    });
    process.on("SIGTERM", () => {
      natsClient.stan.close();
    });

    new TicketCreatedListener(natsClient.stan).listen();
    new TicketUpdatedListener(natsClient.stan).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      auth: {
        username: "root",
        password: "password",
      },
      dbName: "ticket",
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
