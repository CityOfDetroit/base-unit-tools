import { Container } from "@radix-ui/themes";
import React from "react";
import SiteAuth from "./components/SiteAuth";
import { useAuth } from "./contexts/AuthContext";
import { Link } from "react-router-dom";

const SiteHeader = () => {
  const { isAuthenticated, username, handleSignIn, handleSignOut } = useAuth();

  return (
    <header className="flex flex-col gap-2">
      <Container size={"5"}>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <Link to="/">
            <h1 className="cod-style">Base Unit Tools</h1>
            </Link>
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
