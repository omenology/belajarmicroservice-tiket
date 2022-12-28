import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => Promise<string[]>;
}

jest.mock("../utils/NatsClient.ts")

let mongo: MongoMemoryServer | null = null;
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  try {
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri);
    
  } catch (error) {
    console.log("-=-=-=-=-=-=-=-=-=-",error)
  }
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
