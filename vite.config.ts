import fs from 'fs';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function staticMpaPlugin(): Plugin {
  return {
    name: 'static-mpa-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';

        // 1. Serve style.css directly as native text/css
        if (url === '/style.css') {
          const filePath = path.resolve(__dirname, 'style.css');
          if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'text/css; charset=utf-8');
            res.end(fs.readFileSync(filePath, 'utf-8'));
            return;
          }
        }

        // 2. Serve app.js directly as native text/javascript
        if (url === '/app.js') {
          const filePath = path.resolve(__dirname, 'app.js');
          if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
            res.end(fs.readFileSync(filePath, 'utf-8'));
            return;
          }
        }

        // 3. Serve sw.js directly as native text/javascript
        if (url === '/sw.js') {
          const filePath = path.resolve(__dirname, 'sw.js');
          if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
            res.end(fs.readFileSync(filePath, 'utf-8'));
            return;
          }
        }

        // 4. Return explicit 404 for missing static assets instead of serving index.html
        if (url.match(/\.(js|css|json|svg|png|jpg|jpeg|webp|gif|ico|map)$/)) {
          const publicPath = path.resolve(__dirname, 'public', url.slice(1));
          const rootPath = path.resolve(__dirname, url.slice(1));
          if (!fs.existsSync(publicPath) && !fs.existsSync(rootPath)) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end(`404 Not Found: ${url}`);
            return;
          }
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [staticMpaPlugin()],
    appType: 'mpa' as const,
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          explore: path.resolve(__dirname, 'explore.html'),
          event: path.resolve(__dirname, 'event.html'),
          tickets: path.resolve(__dirname, 'tickets.html'),
          checkout: path.resolve(__dirname, 'checkout.html'),
          account: path.resolve(__dirname, 'account.html'),
          organiser: path.resolve(__dirname, 'organiser.html'),
          scan: path.resolve(__dirname, 'scan.html'),
        },
      },
    },
  };
});
