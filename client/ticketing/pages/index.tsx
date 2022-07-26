const LandingPage = ({ color }: { color: string }) => {
  console.log("I am in the component", color);
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = () => {
  console.log("I am on the server!");

  return { color: "red" };
};

export default LandingPage;
