import { EventTicketUpdated, Publisher, Subject } from "@omnlgy/common";

export class TicketUpdatedPublisher extends Publisher<EventTicketUpdated> {
  readonly subject = Subject.TicketUpdated;
}
