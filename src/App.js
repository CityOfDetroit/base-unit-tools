import { useState } from 'react';
import {
  BrowserRouter as Router,
  Route, Switch
} from "react-router-dom";
import Analytics from 'react-router-ga';
import BaseUnitTools from './BaseUnitTools/BaseUnitTools';
import Explorer from './Explorer/Explorer';
import Geocoder from './Geocoder/Geocoder';
import IssueReporter from './IssueReporter/IssueReporter';
import SiteWrapper from './layout/SiteWrapper';
import Validator from './Validator/Validator';
import Mailer from './Mailer/Mailer';

const trackingId = 'UA-107915075-11'

function App() {

  // we use this session to track the ArcGIS Online login
  const [session, setSession] = useState(null)

  return (
    <Router basename='/base-unit-tools'>
      <Analytics id={trackingId} debug>
        <SiteWrapper {...{ session, setSession }} title="Explorer">
          <Switch>
            <Route path="/explorer">
              <Explorer />
            </Route>
            <Route path="/issue-reporter">
              <IssueReporter {...{ session }} />
            </Route>
            <Route path="/validator">
              <Validator />
            </Route>
            <Route path="/mailer">
              <Mailer {...{ session }} />
            </Route>
            {/* {session && <Route path="/assignment">
              <Assignment />
            </Route>} */}
            <Route path="/geocoder">
              <Geocoder />
            </Route>
            <Route path="/">
              <BaseUnitTools {...{ session, setSession }} />
            </Route>
          </Switch>
        </SiteWrapper>
      </Analytics>
    </Router>
  );
}

export default App;
