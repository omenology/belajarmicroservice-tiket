import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./event/TicketCreatedPublisher";

console.clear();
const stan = nats.connect("ticketing", "abc", {
  url: "http://127.0.0.1:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const data = {
    id: "123",
    title: "concert",
    price: 20,
  };

  // stan.publish("ticket:created", data, () => {
  //   console.log("Event published");
  // });
  try {
    const publisher = new TicketCreatedPublisher(stan);
    await publisher.publish(data);
  } catch (error) {
    console.log(error);
  }
});
