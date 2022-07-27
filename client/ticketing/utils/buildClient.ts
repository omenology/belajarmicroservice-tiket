import axios from "axios";
import { IncomingMessage } from "http";

const buildClinet = (req: IncomingMessage) => {
  if (typeof window === "undefined") {
    return axios.create({
      baseURL: "http://ingress-nginx-controller.ingress-nginx/",
    });
  } else {
    return axios.create({
      baseURL: "/",
    });
  }
};

export default buildClinet;
