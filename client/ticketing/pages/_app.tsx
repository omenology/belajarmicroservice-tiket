import "bootstrap/dist/css/bootstrap.min.css";

// import "bootstrap/dist/js/bootstrap.min.js";

import type { AppProps, AppContext } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

MyApp.getInitialProps = async ({ Component, ctx }: AppContext) => {
  return {};
};

export default MyApp;
