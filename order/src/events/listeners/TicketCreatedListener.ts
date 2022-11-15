import { Message } from "node-nats-streaming";
import { Listener, EventTicketCreated, Subject } from "@omnlgy/common";

import { Ticket } from "../../models/ticket";
import { QUEUE_GROUP_NAME } from "../../utils/constants";

export class TicketCreatedListener extends Listener<EventTicketCreated> {
  readonly subject = Subject.TicketCreated;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: EventTicketCreated["data"], msg: Message) {
    const { id, title, price } = data;

    const ticket = Ticket.build({ id, title, price });
    await ticket.save()

    msg.ack()
  }
}
