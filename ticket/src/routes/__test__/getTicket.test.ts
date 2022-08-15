import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";

it("returns a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toString();

  await request(app)
    .get(`/api/tickets/${id}`)
    .set("Cookie", await global.signin())
    .send()
    .expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const title = "concert";
  const price = 20;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", await global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app).get(`/api/tickets/${response.body.data.id}`).send().expect(200);

  expect(ticketResponse.body.attributes.title).toEqual(title);
  expect(ticketResponse.body.attributes.price).toEqual(price);
});
