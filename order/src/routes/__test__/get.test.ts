import request from "supertest";

import app from "../../app";
import { Ticket } from "../../models/ticket";

const createTicket = async () => {
  const ticket = Ticket.build({
    title: "judul",
    price: 10,
  });
  await ticket.save();
  return ticket;
};

it("fetch order for an particular user", async () => {
  const ticketOne = await createTicket();
  const ticketTwo = await createTicket();
  const ticketThree = await createTicket();

  const userOne = await global.signin();
  const userTwo = await global.signin();

  const { body: orderOne } = await request(app).post("/api/orders").set("Cookie", userTwo).send({ ticketId: ticketTwo.id }).expect(201);
  const { body: orderTwo } = await request(app).post("/api/orders").set("Cookie", userTwo).send({ ticketId: ticketThree.id }).expect(201);

  const response = await request(app).get("/api/orders").set("Cookie", userTwo).expect(200);

  expect(response.body.data.length).toEqual(2);
  expect(response.body.data[0].attributes.id).toEqual(orderOne.data.id);
  expect(response.body.data[1].attributes.ticket.id).toEqual(ticketThree.id);
});

it("fetch the order", async () => {
  const ticket = await createTicket();

  const user = await global.signin();

  const { body: order } = await request(app).post("/api/orders").set("Cookie", user).send({ ticketId: ticket.id }).expect(201);

  const { body: fetchOrder } = await request(app).get(`/api/orders/${order.data.id}`).set("Cookie", user).expect(200);

  expect(fetchOrder.attributes.id).toEqual(order.data.id);
});

it("returns an error if one user tries to fetch another user's order", async () => {
    const ticket = await createTicket();

    const { body: order } = await request(app).post("/api/orders").set("Cookie", await global.signin()).send({ ticketId: ticket.id }).expect(201);

    await request(app).get(`/api/orders/${order.data.id}`).set("Cookie", await global.signin()).expect(401);
});
