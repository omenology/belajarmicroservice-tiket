import "bootstrap/dist/css/bootstrap.min.css";

// import "bootstrap/dist/js/bootstrap.min.js";

import type { AppProps, AppContext } from "next/app";
import Header from "../components/header";
import buildClinet from "../utils/buildClient";

const MyApp = ({ Component, pageProps, currentUser, headers }: AppProps & { currentUser: any; headers: any }) => {
  console.log(currentUser);
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />;
    </div>
  );
};

MyApp.getInitialProps = async ({ Component, ctx }: AppContext) => {
  let pageProps: { [key: string]: any } = {};
  try {
    const { data } = await buildClinet(ctx.req!).get("/api/users/currentuser");
    pageProps.currentUser = data;
    if (Component?.getInitialProps) pageProps = await Component.getInitialProps(ctx);

    return { pageProps, currentUser: data, headers: ctx.req?.headers };
  } catch (error) {
    console.log(error);
    return {
      pageProps,
    };
  }
};

export default MyApp;
