import axios, { AxiosRequestHeaders } from "axios";
import { IncomingMessage } from "http";

const buildClinet = (req: IncomingMessage) => {
  if (typeof window === "undefined") {

    return axios.create({
      baseURL: "http://ingress-nginx-controller.ingress-nginx",
      headers: req.headers as AxiosRequestHeaders ,
    });
  } else {
    return axios.create({
      baseURL: "/",
    });
  }
};

export default buildClinet;
