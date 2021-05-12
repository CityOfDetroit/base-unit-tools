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
import Linker from './Linker/Linker';
import Assignment from './Assignment/Assignment'

const trackingId = 'UA-107915075-11'

function App() {

  // we use this session to track the ArcGIS Online login
  const [session, setSession] = useState(null)

  return (
    <Router basename='/base-unit-tools'>
      <Analytics id={trackingId} debug>
        <SiteWrapper {...{ session, setSession }}>
          <Switch>
            <Route path="/explorer">
              <Explorer {...{session}} />
            </Route>
            <Route path="/issue-reporter">
              <IssueReporter {...{ session }} />
            </Route>
            <Route path="/validator">
              <Validator />
            </Route>
            {session && <Route path="/mailer">
              <Mailer {...{ session }} />
            </Route>}
            <Route path="/assignment">
              <Assignment />
            </Route>
            <Route path="/geocoder">
              <Geocoder />
            </Route>
            {session && <Route path="/linker">
              <Linker {...{ session }} />
            </Route>}
            <Route path="/">
              <BaseUnitTools {...{ session }} />
            </Route>
          </Switch>
        </SiteWrapper>
      </Analytics>
    </Router>
  );
}

export default App;
