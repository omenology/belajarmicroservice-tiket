import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { EventOrderCreated, OrderStatus } from "@omnlgy/common";

import { OrderCreatedListener } from "../OrderCreatedListener";
import { natsClient } from "../../../utils/NatsClient";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsClient.stan);

  const data: EventOrderCreated["data"] = {
    id: new mongoose.Types.ObjectId().toString(),
    status: OrderStatus.Created,
    userId: "userid",
    expiresAt: "232323",
    version: 0,
    ticket: {
      id: "asd",
      price: 10,
    },
  };

  // fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("replicates the order", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order).not.toBeNull();
});

it("acks the messages", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
