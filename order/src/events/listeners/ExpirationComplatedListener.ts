import { Message } from "node-nats-streaming";
import { Listener, EventExpirationCompleted, Subject, OrderStatus } from "@omnlgy/common";

import { OrderCancelledPublisher } from "../publishers/OrderCancelledPublisher";
import { Order } from "../../models/order";
import { QUEUE_GROUP_NAME } from "../../utils/constants";

export class ExpirationCompletedListener extends Listener<EventExpirationCompleted> {
  readonly subject = Subject.ExpirationCompleted;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: EventExpirationCompleted["data"], msg: Message) {
    const order = await Order.findById(data.id).populate("ticket");

    if (!order) throw new Error("Order not found");

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
