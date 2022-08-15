import request from "supertest";
import app from "../../app";

const createTicket = async () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", await global.signin())
    .send({
      title: "asldkf",
      price: 20,
    });
};

it("can fetch a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.data).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        attributes: expect.objectContaining({
          title: expect.any(String),
          price: expect.any(Number),
        }),
      }),
    ])
  );
  expect(response.body.data.length).toEqual(3);
});
