import { Subject, EventExpirationCompleted, Publisher } from "@omnlgy/common";

export class ExpirationCompletedPublisher extends Publisher<EventExpirationCompleted> {
  readonly subject = Subject.ExpirationCompleted;
}
