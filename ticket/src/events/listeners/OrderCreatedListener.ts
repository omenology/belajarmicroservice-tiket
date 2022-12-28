import { Message } from "node-nats-streaming";
import { Listener, EventOrderCreated, Subject } from "@omnlgy/common";

import { QUEUE_GROUP_NAME } from "../../utils/constant";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/TicketUpdatedPublisher";

export class OrderCreatedListener extends Listener<EventOrderCreated> {
  readonly subject = Subject.OrderCreated;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: EventOrderCreated["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) throw Error("Ticket not found");

    ticket.set({ orderId: data.id });

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
