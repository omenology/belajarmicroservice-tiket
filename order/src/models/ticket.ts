import { Schema, model, Document, Model } from "mongoose";

interface ticketAttr {
  title: string;
  price: number;
  userId: string;
}

export interface ticketDocument extends Document {
  title: string;
  price: number;
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
      min:0
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: ticketAttr) => {
  return new Ticket(attrs);
};

const Ticket = model<ticketDocument, ticketModel>("Ticket", ticketSchema);

export { Ticket };
