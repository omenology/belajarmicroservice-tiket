import { NextPage } from "next";
import buildClinet from "../utils/buildClient";

const LandingPage: NextPage<any> = (props) => {
  console.log( props);
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  try {
    const { data } = await buildClinet(req!).get("/api/users/currentuser");
    return data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export default LandingPage;
