import { Message } from "node-nats-streaming";
import { Listener } from "./Listener";
import { Subject } from "./constants";
import { EventTicketCreated } from "./interfaceEvent";

export class TicketCreatedListener extends Listener<EventTicketCreated> {
  readonly subject = Subject.TicketCreated;
  queueGroupName = "payment-service";

  onMessage(data: EventTicketCreated["data"], msg: Message) {
    console.log("Event data!", data);

    console.log(data.id);
    console.log(data.title);
    console.log(data.price);

    msg.ack();
  }
}
