import { Publisher, EventOrderCancelled, Subject } from "@omnlgy/common";

export class OrderCancelledPublisher extends Publisher<EventOrderCancelled> {
  readonly subject = Subject.OrderCancelled;
}
