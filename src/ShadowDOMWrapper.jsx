import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Theme } from "@radix-ui/themes";
import 'maplibre-gl/dist/maplibre-gl.css';
import './styles/index.css';  // Import app styles (including Tailwind)
import "@radix-ui/themes/styles.css";
import "@radix-ui/colors/blue-alpha.css";
import "@radix-ui/colors/blue.css";
import "@radix-ui/colors/green-alpha.css";
import "@radix-ui/colors/green.css";
import "@radix-ui/colors/gray-alpha.css";
import "@radix-ui/colors/gray.css";

const ShadowDOMWrapper = ({ cssPath }) => {
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

      const copyRootVariables = () => {
        const link = shadowRootRef.current.querySelector('#bundled-styles');

        if (link) {
          const waitForSheet = new Promise((resolve) => {
            if (link.sheet) {
              resolve(link.sheet);
              return;
            }
            link.onload = () => resolve(link.sheet);
          });

          waitForSheet.then(sheet => {
            let hostStyles = '';

            Array.from(sheet.cssRules).forEach(rule => {
              // Handle regular style rules
              if (rule.type === CSSRule.STYLE_RULE && rule.selectorText.includes(':root')) {
                const newSelector = rule.selectorText.replace(/:root/g, ':host');
                hostStyles += `${newSelector} { ${rule.style.cssText} }\n`;
              }
              // Handle media queries and supports rules
              else if (rule.type === CSSRule.MEDIA_RULE || rule.type === CSSRule.SUPPORTS_RULE) {
                let mediaRules = '';
                Array.from(rule.cssRules).forEach(nestedRule => {
                  if (nestedRule.selectorText && nestedRule.selectorText.includes(':root')) {
                    const newSelector = nestedRule.selectorText.replace(/:root/g, ':host');
                    mediaRules += `${newSelector} { ${nestedRule.style.cssText} }\n`;
                  }
                });
                if (mediaRules) {
                  hostStyles += `${rule.conditionText} {\n${mediaRules}}\n`;
                }
              }
            });

            // Create a style block with the transformed rules
            const variablesStyle = document.createElement('style');
            variablesStyle.textContent = hostStyles;

            shadowRootRef.current.insertBefore(variablesStyle, shadowRootRef.current.firstChild);
          });
        }
      };

      // Add stylesheets
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssPath || './base-unit-tools.css';
      link.id = 'bundled-styles';
      shadowRootRef.current.appendChild(link);

      // Wait for stylesheet to load before copying variables
      link.onload = copyRootVariables;

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

// Initialization function
export const initEmbeddedBaseUnitTools = (elementId, options = {}) => {
  const container = document.getElementById(elementId);
  if (!container) {
    console.error(`Container with id "${elementId}" not found`);
    return;
  }

  const root = createRoot(container);
  root.render(<ShadowDOMWrapper cssPath={options.cssPath} />);
};

// Export for use in embedded-index.js
export default initEmbeddedBaseUnitTools;