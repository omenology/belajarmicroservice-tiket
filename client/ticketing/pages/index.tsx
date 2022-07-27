import { NextPage } from "next";
import buildClinet from "../utils/buildClient";

const LandingPage: NextPage<any> = ({ color }: { color: string }) => {
  console.log("I am in the component", color);
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  const { data } = await buildClinet(req!).get("/api/users/currentuser");
  console.log(data);
  return data;
};

export default LandingPage;
