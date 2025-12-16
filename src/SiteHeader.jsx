import { Container } from "@radix-ui/themes";
import React, { useEffect } from "react";
import SiteAuth from "./components/SiteAuth";
import { useAuth } from "./contexts/AuthContext";
import { Link } from "react-router-dom";

const SiteHeader = () => {
  const { isAuthenticated, username, handleSignIn, handleSignOut } = useAuth();

  return (
    <header className="flex flex-col gap-2">
      <Container size={"5"}>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center justify-around">
            <img
              src="./logo-black.png"
              alt="City of Detroit logo"
              className="h-12 w-12"
            />
            <div className="flex flex-col">
              <Link to="/">
                <h1 className="cod-style">Base Unit Tools</h1>
              </Link>
              <span className="text-xs w-96 hidden md:block leading-4">
                Explore Detroit's addresses, buildings, parcels, and streets.
              </span>
            </div>
          </div>
          <SiteAuth
            {...{ isAuthenticated, username, handleSignIn, handleSignOut }}
          />
        </div>
      </Container>
    </header>
  );
};

export default SiteHeader;
