import { Message } from "node-nats-streaming";
import { Listener, EventOrderCancelled, Subject } from "@omnlgy/common";

import { QUEUE_GROUP_NAME } from "../../utils/constant";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/TicketUpdatedPublisher";

export class OrderCancelledListener extends Listener<EventOrderCancelled> {
  readonly subject = Subject.OrderCancelled;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: EventOrderCancelled["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) throw new Error("Ticket not found");

    ticket.set({ orderId: undefined });

    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket?.orderId,
      version: ticket.version,
    });

    msg.ack();
  }
}
