import { Schema, model, Document, Model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ticketAttr {
  title: string;
  price: number;
  userId: string;
  orderId?: string;
}

interface ticketDocument extends Document {
  title: string;
  price: number;
  userId: string;
  orderId?: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

interface ticketModel extends Model<ticketDocument> {
  build(attrs: ticketAttr): ticketDocument;
}

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.statics.build = (attrs: ticketAttr) => {
  return new Ticket(attrs);
};

const Ticket = model<ticketDocument, ticketModel>("Ticket", ticketSchema);

export { Ticket };
