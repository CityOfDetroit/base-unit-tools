// src/Layout.js
import React, { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import { useTheme } from "./contexts/ThemeContext";
import { Container } from "@radix-ui/themes";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
};

export default Layout;
