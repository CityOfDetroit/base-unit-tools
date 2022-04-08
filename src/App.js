import { useState } from 'react';
import {
  BrowserRouter as Router,
  Route, Switch
} from "react-router-dom";

import Analytics from 'react-router-ga';
import BaseUnitTools from './BaseUnitTools/BaseUnitTools';
import Explorer from './Explorer/Explorer';
import Geocoder from './Geocoder/Geocoder';
import SiteWrapper from './layout/SiteWrapper';
import Validator from './Validator/Validator';
import Mailer from './Mailer/Mailer';
import Linker from './Linker/Linker';
import Assignment from './Assignment/Assignment'

const trackingId = 'UA-107915075-11'

function App() {

  // we use this session to track the ArcGIS Online login
  const [session, setSession] = useState(null)

  // get the current browser URL to highlight the correct nav entry
  // const location = useLocation()

  // let currentApp = Object.keys(apps).find(app => apps[app].url === location.pathname)

  const [login, setLogin] = useState(false)

  return (
    <Router basename='/base-unit-tools'>
      <Analytics id={trackingId} debug>
        <SiteWrapper {...{ session, setSession }}>
          <Switch>
            <Route path="/explorer">
              <Explorer {...{session, setSession, login, setLogin }} />
            </Route>
            <Route path="/validator">
              <Validator {...{session, setSession, login, setLogin }} />
            </Route>
            {session && <Route path="/mailer">
              <Mailer {...{session, setSession, login, setLogin }} />
            </Route>}
            {session && <Route path="/assignment">
              <Assignment {...{session, setSession, login, setLogin }}/>
            </Route>}
            <Route path="/geocoder">
              <Geocoder {...{session, setSession, login, setLogin }} />
            </Route>
            {session && <Route path="/linker">
              <Linker {...{session, setSession, login, setLogin }} />
            </Route>}
            <Route path="/">
              <BaseUnitTools {...{session, setSession, login, setLogin }} />
            </Route>
          </Switch>
        </SiteWrapper>
      </Analytics>
    </Router>
  );
}

export default App;
