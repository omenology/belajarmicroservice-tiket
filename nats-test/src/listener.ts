import nats,{Message} from "node-nats-streaming";
import {randomBytes} from "crypto";

console.clear()
const stan = nats.connect("ticketing", randomBytes(8).toString("hex"), {
  url: "http://127.0.0.1:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");
  const options = stan.subscriptionOptions().setManualAckMode(true);
  const subscription = stan.subscribe("ticket:created", "orders-service-queue-group",options);
  subscription.on("message", (msg:Message) => {
    console.log("Message received ",msg.getSequence(),"=>",msg.getData());
    msg.ack()
  });
});
