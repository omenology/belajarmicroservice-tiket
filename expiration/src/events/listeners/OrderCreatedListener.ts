import { Message } from "node-nats-streaming";
import { Listener, EventOrderCreated, Subject } from "@omnlgy/common";

import { QUEUE_GROUP_NAME } from "../../utils/constant";
import { expirationQueue } from "../../queues/expirationQueue";

export class OrderCreatedListener extends Listener<EventOrderCreated> {
  readonly subject = Subject.OrderCreated;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: EventOrderCreated["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    expirationQueue.add(
      "order:expiration",
      {
        orderId: data.id,
        version: data.version,
      },
      { delay }
    );

    msg.ack();
  }
}
