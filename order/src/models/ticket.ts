import { Schema, model, Document, Model } from "mongoose";
import { OrderStatus, EventTicketUpdated } from "@omnlgy/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

import { Order } from "./order";

interface ticketAttr {
  id: string;
  title: string;
  price: number;
}

export interface ticketDocument extends Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
  version: number;
}
interface ticketModel extends Model<ticketDocument> {
  build(attrs: ticketAttr): ticketDocument;
  findByIdAndPreviousVersion(dataEvent: EventTicketUpdated["data"]): Promise<ticketDocument | null>;
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

ticketSchema.set("versionKey", "version");

ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByIdAndPreviousVersion = (dataEvent: EventTicketUpdated["data"]) => {
  return Ticket.findOne({
    _id: dataEvent.id,
    version: dataEvent.version - 1,
  });
};
ticketSchema.statics.build = (attrs: ticketAttr) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
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
