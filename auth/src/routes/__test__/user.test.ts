import request from "supertest";
import app from "../../app";

describe("test signup user", () => {
  test.each([
    { body: { email: "email@mail.com", password: "password" }, expected: 201 },
    { body: { email: "email@mail.com", password: "password" }, expected: 400 },
    { body: { email: "emailmail.com", password: "password" }, expected: 400 },
    { body: { email: "email@mail.com", password: "p" }, expected: 400 },
    { body: { email: "", password: "123456" }, expected: 400 },
    { body: { email: "email1@mail.com", password: "" }, expected: 400 },
    { body: { email: "", password: "" }, expected: 400 },
    { body: {}, expected: 400 },
  ])("returns $expected when email: '$body.email' and password: '$body.password'", async (dataTest) => {
    await request(app).post("/api/users/signup").send(dataTest.body).expect(dataTest.expected);
  });

  it("sets a cookie after successful signup", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send({
        email: "email2@mail.com",
        password: "password",
      })
      .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
