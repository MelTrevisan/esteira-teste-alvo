// Servidores estáticos simples não têm "fallback" de SPA. Para as rotas fixas abrirem direto,
// copia o index.html para uma pasta por rota.
import { cpSync, mkdirSync } from 'node:fs';

for (const rota of ['eventos', 'eventos/novo']) {
  mkdirSync(`dist/${rota}`, { recursive: true });
  cpSync('dist/index.html', `dist/${rota}/index.html`);
}
console.log('rotas estáticas: ok');
