import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";

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

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) await mongo.stop();
  if (mongoose.connection.readyState == 1) await mongoose.connection.close();
});

global.signin = async () => {
  const payload = {
    email: "email@mail.com",
    id: new mongoose.Types.ObjectId().toString(),
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const sessionBase64 = Buffer.from(JSON.stringify({ token })).toString("base64");

  return [`session=${sessionBase64}`];
};
