import mongoose from "mongoose";
import request from "supertest";

import app from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsClient } from "../../utils/NatsClient";

it("returns an err if the ticket doesn't exist", async () => {
  const ticketId = new mongoose.Types.ObjectId().toString();
  await request(app)
    .post("/api/orders/")
    .set("Cookie", await global.signin())
    .send({ ticketId })
    .expect(404);
});

it("returns an err if the ticket already have reserved", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString(),
    title: "con",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    status: OrderStatus.Created,
    expiresAt: new Date(),
    userId: new mongoose.Types.ObjectId().toString(),
  });
  await order.save();

  await request(app)
    .post("/api/orders/")
    .set("Cookie", await global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket and publis event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toString(),
    title: "con",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders/")
    .set("Cookie", await global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsClient.stan.publish).toHaveBeenCalled();
});
