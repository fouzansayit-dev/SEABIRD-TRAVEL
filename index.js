import { serve } from 'srvx';
import { serveStatic } from 'srvx/static';
import serverHandler from './dist/server/server.js';

// Hostinger will pass the port via process.env.PORT
const port = process.env.PORT || 3000;

serve({
  port: Number(port),
  hostname: '0.0.0.0',
  fetch: serverHandler.fetch,
  middleware: [
    // Serve the built static client assets (CSS, JS, images, etc.)
    serveStatic({
      dir: 'dist/client',
    }),
  ],
});

console.log(`Server started on port ${port}`);
