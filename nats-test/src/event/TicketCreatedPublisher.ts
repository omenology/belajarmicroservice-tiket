import { Publisher } from "./Publisher";
import { EventTicketCreated } from "./interfaceEvent";
import { Subject } from "./constants";

export class TicketCreatedPublisher extends Publisher<EventTicketCreated> {
  readonly subject = Subject.TicketCreated;
}
