import './styles/App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import BaseUnitTools from './BaseUnitTools/BaseUnitTools';
import Explorer from './Explorer/Explorer';
import Geocoder from './Geocoder/Geocoder';
import IssueReporter from './IssueReporter/IssueReporter';
import Validator from './Validator/Validator';
import { useState, useContext } from 'react';
import SiteWrapper from './layout/SiteWrapper';
import Mailer from './Mailer/Mailer';
import Assignment from './Assignment/Assignment';
import Analytics from 'react-router-ga';

const trackingId = 'UA-107915075-11'

function App() {

  const [session, setSession] = useState(null)
  
  return (
    <Router basename='/base-unit-tools'>
      <Analytics id={trackingId} debug>
      <SiteWrapper {...{session, setSession}} title="Explorer">
        <Switch>
            <Route path="/explorer/:layer/:id">
              <Explorer/>
            </Route>
            <Route path="/explorer/:layer">
              <Explorer/>
            </Route>
            <Route path="/explorer">
              <Explorer />
            </Route>
            <Route path="/issue-reporter">
              <IssueReporter {...{session}} />
            </Route>
            <Route path="/validator">
              <Validator />
            </Route>
            {/* <Route path="/mailer">
              <Mailer {...{session}} />
            </Route> */}
            {/* {session && <Route path="/assignment">
              <Assignment />
            </Route>} */}
            <Route path="/geocoder/:address">
              <Geocoder />
            </Route>
            <Route path="/geocoder">
              <Geocoder />
            </Route>
            <Route path="/">
              <BaseUnitTools {...{session, setSession}}/>
            </Route>
        </Switch>
      </SiteWrapper>
      </Analytics>
    </Router>
  );
}

export default App;
