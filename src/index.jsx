import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import 'maplibre-gl/dist/maplibre-gl.css';
import "./styles/index.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <html>
      <body>
        <Theme accentColor="green" grayColor="sand" radius="small" scaling="100%">
          <App />
        </Theme>
      </body>
    </html>
  </React.StrictMode>
);
