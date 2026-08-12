import { defineConfig } from 'vite';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

export default defineConfig({
  plugins: [
    {
      name: 'serve-mining-pages',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = (req.url || '').split('?')[0].replace(/\/+$/, '') || '/';

          if (url === '/mining' || url.startsWith('/mining/')) {
            const slug = url === '/mining' ? '' : url.replace('/mining/', '');

            if (slug.startsWith('assets/')) return next();

            const filePath = slug
              ? join(process.cwd(), 'public', 'mining', slug, 'index.html')
              : join(process.cwd(), 'public', 'mining', 'index.html');

            if (existsSync(filePath)) {
              let html = readFileSync(filePath, 'utf-8');
              server.transformIndexHtml(url, html).then(transformed => {
                res.setHeader('Content-Type', 'text/html');
                res.statusCode = 200;
                res.end(transformed);
              }).catch(() => {
                res.setHeader('Content-Type', 'text/html');
                res.statusCode = 200;
                res.end(html);
              });
              return;
            }
          }
          next();
        });
      },
    },
  ],
});
