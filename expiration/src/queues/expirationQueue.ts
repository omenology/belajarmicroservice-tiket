import { Queue, Worker } from "bullmq";

import { natsClient } from "../utils/NatsClient";
import { ExpirationCompletedPublisher } from "../events/publishers/ExpirationComplatedPublisher";

interface Payload {
  orderId: string;
  version: number;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  connection: {
    host: process.env.REDIS_HOST,
    port: 6379,
  },
});

const expirationWorker = new Worker<Payload>(
  "order:expiration",
  async (job) => {
    new ExpirationCompletedPublisher(natsClient.stan).publish({
      id: job.data.orderId,
      version: job.data.version,
    });
    return;
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: 6379,
    },
  }
);

export { expirationQueue, expirationWorker };
