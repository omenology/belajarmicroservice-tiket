import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();
const stan = nats.connect("ticketing", randomBytes(8).toString("hex"), {
  url: "http://127.0.0.1:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection close");
    process.exit();
  });

  const options = stan.subscriptionOptions().setManualAckMode(true).setDeliverAllAvailable().setDurableName("order-service");
  const subscription = stan.subscribe("ticket:created", "orders-service-queue-group", options);
  subscription.on("message", (msg: Message) => {
    console.log("Message received ", msg.getSequence(), "=>", msg.getData());
    msg.ack();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
