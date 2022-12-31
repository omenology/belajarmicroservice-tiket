import { natsClient } from "./utils/NatsClient";

const PORT = process.env.PORT || 3000;
const start = async () => {
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
  } catch (err) {
    console.log(err);
  }
};

start();
