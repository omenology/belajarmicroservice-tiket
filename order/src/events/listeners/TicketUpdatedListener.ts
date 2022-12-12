import { Message } from "node-nats-streaming";
import { Listener, EventTicketUpdated, Subject } from "@omnlgy/common";

import { Ticket } from "../../models/ticket";
import { QUEUE_GROUP_NAME } from "../../utils/constants";

export class TicketUpdatedListener extends Listener<EventTicketUpdated> {
  readonly subject = Subject.TicketUpdated;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: EventTicketUpdated["data"], msg: Message) {
    const { title, price } = data;
    const ticket = await Ticket.findByIdAndPreviousVersion(data);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
