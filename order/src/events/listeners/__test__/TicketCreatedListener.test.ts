import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { EventTicketCreated } from "@omnlgy/common";

import { Ticket } from "../../../models/ticket";
import { TicketCreatedListener } from "../TicketCreatedListener";
import { natsClient } from "../../../utils/NatsClient";

const setup = async () => {
  const listener = new TicketCreatedListener(natsClient.stan);

  // fake date
  const data: EventTicketCreated["data"] = {
    id: new mongoose.Types.ObjectId().toString(),
    title: "title1",
    price: 10,
    userId: new mongoose.Types.ObjectId().toString(),
    version: 0,
  };

  // fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and save ticket", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});
it("acks the messages", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data,msg)

  expect(msg.ack).toHaveBeenCalled()
});
