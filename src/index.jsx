import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import 'maplibre-gl/dist/maplibre-gl.css';
import "./styles/index.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

// Function to initialize the app
export function initBaseUnitTools(elementId, options = {}) {
  const root = createRoot(document.getElementById(elementId));
  root.render(
    <React.StrictMode>
      <Theme accentColor="green" grayColor="sand" radius="small" scaling="100%">
        <App
          mode={options.mode || 'embedded'}
          basePath={options.basePath || ''}
        />
      </Theme>
    </React.StrictMode>
  );
}

// If running standalone
if (document.getElementById('root')) {
  initBaseUnitTools('root', { mode: 'standalone' });
}