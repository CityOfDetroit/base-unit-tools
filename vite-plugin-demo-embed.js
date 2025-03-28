import fs from 'fs';
import path from 'path';

/**
 * Vite plugin to generate a demo HTML file for the embedded app
 */
export default function demoEmbedPlugin() {
  return {
    name: 'vite-plugin-demo-embed',
    closeBundle: {
      sequential: true,
      handler() {
        // Only run when building embedded version
        if (process.env.BUILD_TARGET !== 'embedded') {
          return;
        }

        const outputDir = 'build/embedded';
        const htmlContent = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Base Unit Tools - Embedded Demo</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
              }
              header, footer {
                background-color: #f5f5f5;
                padding: 20px;
                margin: 20px 0;
              }
              .demo-container {
                margin: 40px 0;
                border: 1px solid #ccc;
                padding: 20px;
              }
              .code-block {
                background-color: #f5f5f5;
                padding: 15px;
                border-radius: 5px;
                overflow-x: auto;
                font-family: monospace;
                margin: 20px 0;
              }
              h1, h2, h3 {
                color: #333;
              }
            </style>
          </head>
          <body>
            <header>
              <h1>Base Unit Tools - Embedded Demo</h1>
              <p>This page demonstrates how to embed the Base Unit Tools application in your website.</p>
            </header>

            <main>
              <section>
                <h2>Demo</h2>
                <p>Below is the embedded app in action:</p>
                <div class="demo-container">
                  <div id="base-unit-tools-demo"></div>
                </div>
              </section>

              <section>
                <h2>How to Embed</h2>
                <p>To embed the Base Unit Tools in your website, follow these steps:</p>
                
                <h3>1. Create a container element</h3>
                <div class="code-block">
                  &lt;div id="base-unit-tools-container"&gt;&lt;/div&gt;
                </div>
                
                <h3>2. Import and initialize the app</h3>
                <div class="code-block">
                  &lt;script type="module"&gt;
                    import { initEmbeddedBaseUnitTools } from 'path/to/base-unit-tools.js';
                    
                    // Initialize with default CSS path (same directory as JS)
                    initEmbeddedBaseUnitTools('base-unit-tools-container');
                    
                    // Or specify a custom CSS path
                    // initEmbeddedBaseUnitTools('base-unit-tools-container', {
                    //   cssPath: 'https://example.com/path/to/base-unit-tools.css'
                    // });
                  &lt;/script&gt;
                </div>
              </section>
            </main>

            <!-- Demo implementation -->
            <link rel="stylesheet" href="./base-unit-tools.css">
            <script type="module">
              import { initEmbeddedBaseUnitTools } from './base-unit-tools.js';
              initEmbeddedBaseUnitTools('base-unit-tools-demo', {
                cssPath: './base-unit-tools.css'
              });
            </script>
          </body>
        </html>`;

        // Write the HTML file to the output directory
        const outputPath = path.resolve(outputDir, 'demo-embed.html');
        fs.writeFileSync(outputPath, htmlContent);
        
        console.log(`Demo embed HTML file created at: ${outputPath}`);
      }
    }
  };
}