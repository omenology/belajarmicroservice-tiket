import { Schema, model, Document, Model } from "mongoose";
import { PasswordHooks } from "../utils/passwordHooks";

interface userAttr {
  email: string;
  password: string;
}

interface userDocument extends Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface userModel extends Model<userDocument> {
  build(attrs: userAttr): userDocument;
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

userSchema.statics.build = (attrs: userAttr) => {
  return new User(attrs);
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await PasswordHooks.hashPassword(this.get("password"));
    this.set("password", hashedPassword);
  }
  next();
});

const User = model<userDocument, userModel>("User", userSchema);

export { User };
