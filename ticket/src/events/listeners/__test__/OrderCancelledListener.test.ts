import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { EventOrderCancelled, OrderStatus } from "@omnlgy/common";

import { OrderCancelledListener } from "../OrderCancelledListener";
import { Ticket } from "../../../models/ticket";
import { natsClient } from "../../../utils/NatsClient";

const setup = async () => {
  const listener = new OrderCancelledListener(natsClient.stan);

  const orderId = new mongoose.Types.ObjectId().toString();
  const ticket = Ticket.build({
    title: "ticket1",
    price: 10,
    userId: "userid",
  });

  ticket.set({
    orderId,
  });

  await ticket.save();

  const data: EventOrderCancelled["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket!.id,
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

  expect(updatedTicket!.orderId).toBeUndefined()
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

  // console.log((natsClient.stan.publish as jest.Mock).mock.calls)
});
