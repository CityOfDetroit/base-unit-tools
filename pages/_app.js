import SiteFooter from "../src/layout/SiteFooter";
import SiteHeader from "../src/layout/SiteHeader";
import { useState } from "react";
import "../src/styles/index.css"

// const trackingId = "UA-107915075-11";

function MyApp({ Component, pageProps }) {

  const [session, setSession] = useState(null);
  const [login, setLogin] = useState(false);

  return (
    <div id="root">
      <SiteHeader {...{ session, setSession, login, setLogin }} />      
      <Component {...pageProps} {...{ session, setSession, login, setLogin }} />
      <SiteFooter />
    </div>
  );
}


export default MyApp;