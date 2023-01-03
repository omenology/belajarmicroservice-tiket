import { Message } from "node-nats-streaming";
import { Listener, EventOrderCreated, Subject } from "@omnlgy/common";

import { QUEUE_GROUP_NAME } from "../../utils/constant";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<EventOrderCreated> {
  readonly subject = Subject.OrderCreated;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: EventOrderCreated["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      userId: data.userId,
      version: data.version,
      status: data.status,
      price: data.ticket.price,
    });
    await order.save();

    msg.ack();
  }
}
