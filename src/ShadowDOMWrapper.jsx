import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Theme } from "@radix-ui/themes";
import './styles/index.css';  // Import app styles (including Tailwind)

const ShadowDOMWrapper = () => {
  const hostRef = useRef(null);
  const shadowRootRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    if (hostRef.current && !shadowRootRef.current) {
      // Create shadow root
      shadowRootRef.current = hostRef.current.attachShadow({ mode: 'open' });

      // Create a container for React content
      const container = document.createElement('div');
      container.id = 'shadow-root';
      shadowRootRef.current.appendChild(container);

      // Add required stylesheets
      const stylesheets = [
        { href: '/base-unit-tools.css', id: 'bundled-styles' }, // Bundled styles
        { href: 'https://unpkg.com/@radix-ui/themes@3.1.4/styles.css', id: 'radix-styles' },
        { href: 'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css', id: 'maplibre-styles' }
      ];

      stylesheets.forEach(({ href, id }) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.id = id;
        shadowRootRef.current.appendChild(link);
      });

      // Create root and render app
      rootRef.current = createRoot(container);
      rootRef.current.render(
        <React.StrictMode>
          <Theme accentColor="green" grayColor="sand" radius="small" scaling="100%">
            <App mode={'embedded'} basePath={''}
            />
          </Theme>
        </React.StrictMode>
      );
    }

    return () => {
      if (rootRef.current) {
        rootRef.current.unmount();
      }
    };
  });

  return <div ref={hostRef} className="base-unit-tools-container" />;
};

// Modified initialization function
export const initEmbeddedBaseUnitTools = (elementId) => {
  const container = document.getElementById(elementId);
  if (!container) {
    console.error(`Container with id "${elementId}" not found`);
    return;
  }

  const root = createRoot(container);
  root.render(<ShadowDOMWrapper />);
};

// Export for use in embedded-index.js
export default initEmbeddedBaseUnitTools;