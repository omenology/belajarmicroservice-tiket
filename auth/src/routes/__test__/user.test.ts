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

describe("test signin user", () => {
  test.each([
    { body: { email: "", password: "" }, expected: 400 },
    { body: { email: "emial@mail.com", password: "" }, expected: 400 },
    { body: { email: "", password: "123456" }, expected: 400 },
    { body: { email: "email@mail.com", password: "123456" }, expected: 400 },
    { body: { email: "emailmail.com", password: "123456" }, expected: 400 },
    { body: { email: "email@mail.com", password: "password" }, expected: 200 },
  ])("returns $expected when email: '$body.email' and password: '$body.password'", async (dataTest) => {
    const response = await request(app).post("/api/users/signin").send(dataTest.body).expect(dataTest.expected);
    if (dataTest.expected === 200) {
      expect(response.get("Set-Cookie")).toBeDefined();
    }
  });
});

it("test signout user", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "email@mail.com",
      password: "password",
    })
    .expect(200);
  const response = await request(app).post("/api/users/signout").expect(200);

  expect(response.get("Set-Cookie")[0]).toEqual("session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly");
});

it("test get current user", async () => {
  const cookie = await global.signin();
  const response = await request(app).get("/api/users/currentuser").set("Cookie", cookie).send().expect(200);
  expect(response.body.data.attributes.email).toEqual("email@mail.com");
});

it("test get current user with no cookie", async () => {
  const response = await request(app).get("/api/users/currentuser").send().expect(401);
  expect(response.body.errors[0].message).toEqual("Unauthorized");
})
