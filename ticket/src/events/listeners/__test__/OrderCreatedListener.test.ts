import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { EventOrderCreated, OrderStatus } from "@omnlgy/common";

import { OrderCreatedListener } from "../OrderCreatedListener";
import { Ticket } from "../../../models/ticket";
import { natsClient } from "../../../utils/NatsClient";

const setup = async () => {
  const listener = new OrderCreatedListener(natsClient.stan);

  const ticket = Ticket.build({
    title: "ticket1",
    price: 10,
    userId: "userid",
  });

  await ticket.save();

  const data: EventOrderCreated["data"] = {
    id: new mongoose.Types.ObjectId().toString(),
    status: OrderStatus.Created,
    userId: "userid",
    expiresAt: "232323",
    version: 0,
    ticket: {
      id: ticket!.id,
      price: ticket!.price,
    },
  };

  // fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("sets the orderId of the ticket", async () => {
  const { data, listener, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the messages", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishs ticket update event", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsClient.stan.publish).toHaveBeenCalled();
});
