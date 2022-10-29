import { Schema, model, Document, Model } from "mongoose";
import { Order } from "./order";
import { OrderStatus } from "@omnlgy/common";

interface ticketAttr {
  title: string;
  price: number;
}

export interface ticketDocument extends Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
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
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: ticketAttr) => {
  return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async function (): Promise<Boolean> {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: { $ne: OrderStatus.Cancelled },
  });
  return !!existingOrder;
};

const Ticket = model<ticketDocument, ticketModel>("Ticket", ticketSchema);

export { Ticket };
