const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');


const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  let filePath = '.' + pathname;

  if (filePath === './') {
    filePath = './login.html';
  } else if (pathname === '/detalhes' && query.id) {
    filePath = './detalhes.html';
  }

  filePath = path.resolve(filePath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('Página não encontrada!');
      } else {
        res.writeHead(500);
        res.end('Desculpe, ocorreu um erro no servidor.');
      }
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/`);
});
