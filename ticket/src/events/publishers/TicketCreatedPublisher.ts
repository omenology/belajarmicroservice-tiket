import { Publisher, EventTicketCreated, Subject } from "@omnlgy/common";

export class TicketCreatedPublisher extends Publisher<EventTicketCreated> {
  readonly subject = Subject.TicketCreated;
}
