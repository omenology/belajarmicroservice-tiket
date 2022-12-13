import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { EventTicketCreated } from "@omnlgy/common";

import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../TicketUpdatedListener";
import { natsClient } from "../../../utils/NatsClient";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsClient.stan);

  // create ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString(),
    title: "title1",
    price: 10,
  });
  await ticket.save();

  // fake date
  const data: EventTicketCreated["data"] = {
    id: ticket.id,
    title: "title1ed",
    price: 15,
    userId: new mongoose.Types.ObjectId().toString(),
    version: ticket.version + 1,
  };

  // fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("fins, update, and save ticket", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const ticketUpdated = await Ticket.findById(ticket.id);

  expect(ticketUpdated).toBeDefined();
  expect(ticketUpdated!.title).toEqual(data.title);
  expect(ticketUpdated!.price).toEqual(data.price);
  expect(ticketUpdated!.version).toEqual(data.version);
});
it("acks the messages", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
