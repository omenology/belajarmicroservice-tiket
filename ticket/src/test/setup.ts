import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: MongoMemoryServer | null = null;
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
});

// beforeEach(async () => {
//   const collections = await mongoose.connection.db.collections();

//   for (let collection of collections) {
//     await collection.deleteMany({});
//   }
// });

afterAll(async () => {
  if (mongo) await mongo.stop();
  if (mongoose.connection.readyState == 1) await mongoose.connection.close();
});

global.signin = async () => {
  const res = await request(app).post("/api/users/signin").send({
    email: "email@mail.com",
    password: "password",
  });
  return res.get("Set-Cookie");
};
