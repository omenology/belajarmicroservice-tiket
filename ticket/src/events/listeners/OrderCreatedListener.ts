import { Message } from "node-nats-streaming";
import { Listener, EventOrderCreated, Subject, OrderStatus } from "@omnlgy/common";
import { QUEUE_GROUP_NAME } from "../../utils/constant";

export class OrderCreatedListener extends Listener<EventOrderCreated> {
  readonly subject = Subject.OrderCreated;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: EventOrderCreated["data"], msg: Message) {}
}
