import { NextPage } from "next";

const LandingPage: NextPage<any> = ({ currentUser }: any) => {
  return <h1>{currentUser ? "Your signin" : "Your not signin"}</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  return {};
};

export default LandingPage;
