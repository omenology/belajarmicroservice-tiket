import request from "supertest";

import app from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";

it("marks an order as canceled", async () => {
  const ticket = Ticket.build({
    title: "ticket",
    price: 10,
  });
  await ticket.save();

  const user = await global.signin();

  const { body: order } = await request(app).post("/api/orders").set("Cookie", user).send({ ticketId: ticket.id }).expect(201);

  await request(app).patch(`/api/orders/${order.data.id}`).set("Cookie", user).expect(200);

  const updatedOrder = await Order.findById(order.data.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
