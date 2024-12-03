// src/Layout.js
import React from "react";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <SiteHeader />
        {children}
      <SiteFooter />
    </div>
  );
};

export default Layout;
