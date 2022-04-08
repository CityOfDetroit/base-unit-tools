import React from 'react';
import SiteFooter from './SiteFooter';


const SiteWrapper = ({ session, setSession, children }) => {

  return (
    <>
      {children}
      <SiteFooter />
    </>
  )
}

export default SiteWrapper;