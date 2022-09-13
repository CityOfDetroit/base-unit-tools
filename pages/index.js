import { useState } from 'react';

import BaseUnitTools from '../src/BaseUnitTools/BaseUnitTools';

const trackingId = 'UA-107915075-11'

function App() {

  // we use this session to track the ArcGIS Online login
  const [session, setSession] = useState(null)

  // get the current browser URL to highlight the correct nav entry
  // const location = useLocation()

  // let currentApp = Object.keys(apps).find(app => apps[app].url === location.pathname)

  const [login, setLogin] = useState(false)

  return (
    <BaseUnitTools {...{session, setSession, login, setLogin }} />
  );
}

export default App;
