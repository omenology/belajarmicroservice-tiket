import { Schema, model } from "mongoose";

interface userAttrType {
  email: string;
  password: string;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = model("User", userSchema);
const buildUser = (attr: userAttrType) => {
  return new User(attr);
};

export { User };
