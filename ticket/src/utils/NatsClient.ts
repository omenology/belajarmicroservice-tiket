import nats, { Stan } from "node-nats-streaming";
export class NatsClient {
  private static stan?: Stan;

  constructor(clusterId: string, clientId: string, url: string) {
    if (!NatsClient?.stan) {
      NatsClient.stan = nats.connect(clusterId, clientId, { url });
      NatsClient.stan.on("connect", () => {
        console.log("Nats connection established");
      });
      NatsClient.stan.on("error", (err) => {
        throw Error(err);
      });
    } else console.log("Nats connection established");
  }
  getStan() {
    if (NatsClient.stan) return NatsClient.stan;
    else throw Error("Nats clinet not declare ");
  }
}
