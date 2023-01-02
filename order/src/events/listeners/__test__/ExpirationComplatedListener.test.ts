import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { EventExpirationCompleted, OrderStatus } from "@omnlgy/common";

import { ExpirationCompletedListener } from "../ExpirationComplatedListener";
import { natsClient } from "../../../utils/NatsClient";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  const listener = new ExpirationCompletedListener(natsClient.stan);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString(),
    title: "ticker",
    price: 10,
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    expiresAt: new Date(),
    userId: new mongoose.Types.ObjectId().toString(),
    ticket,
  });
  await order.save();

  // fake date
  const data: EventExpirationCompleted["data"] = {
    id: order.id,
    version: 0,
  };

  // fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket, order };
};

it("updates the order status to cancelled", async () => {
  const { listener, msg, data, ticket, order } = await setup();

  await listener.onMessage(data, msg);

  const newOrder = await Order.findById(order.id);

  expect(newOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an event order cancelled", async () => {
  const { listener, msg, data, ticket, order } = await setup();

  await listener.onMessage(data, msg);

  expect(natsClient.stan.publish).toHaveBeenCalled();
  expect((natsClient.stan.publish as jest.Mock).mock.calls[0][0]).toEqual("order:cancelled");
});

it("acks the messages", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
