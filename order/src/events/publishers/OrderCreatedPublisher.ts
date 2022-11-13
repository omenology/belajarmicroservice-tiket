import { Publisher, EventOrderCreated, Subject } from "@omnlgy/common";

export class OrderCreatedPublisher extends Publisher<EventOrderCreated> {
  readonly subject = Subject.OrderCreated;
}
