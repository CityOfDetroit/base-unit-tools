// import App from 'next/app'

import SiteFooter from "../src/layout/SiteFooter";
import { useState } from "react";

const trackingId = "UA-107915075-11";

function MyApp({ Component, pageProps }) {
  // we use this session to track the ArcGIS Online login
  const [session, setSession] = useState(null);

  // get the current browser URL to highlight the correct nav entry
  // const location = useLocation()

  // let currentApp = Object.keys(apps).find(app => apps[app].url === location.pathname)

  const [login, setLogin] = useState(false);

  return (
    <>
        <Component {...pageProps} {...{ session, setSession, login, setLogin }} />
        <SiteFooter />
    </>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
