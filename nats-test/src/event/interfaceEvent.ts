import { Subject } from "./constants";

export interface Event {
  subject: Subject;
  data: any;
}

export interface EventTicketCreated {
  subject: Subject.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
