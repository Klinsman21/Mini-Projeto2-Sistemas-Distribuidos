const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');

const app = express();
const client = redis.createClient();

app.use(bodyParser.json());

// Endpoint para adicionar um comentário
app.post('/comentarios/:livroId', (req, res) => {
  const { livroId } = req.params;
  const { autor, comentario } = req.body;

  const dataHoraPostagem = new Date().toLocaleString();

  const novoComentario = {
    autor,
    comentario,
    dataHoraPostagem,
  };

  client.hset(`livro:${livroId}:comentarios`, dataHoraPostagem, JSON.stringify(novoComentario), (err, reply) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao adicionar comentário');
    } else {
      res.status(201).send('Comentário adicionado com sucesso');
    }
  });
});

// Endpoint para obter todos os comentários de um livro
app.get('/comentarios/:livroId', (req, res) => {
  const { livroId } = req.params;

  client.hgetall(`livro:${livroId}:comentarios`, (err, comentarios) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao obter comentários');
    } else {
      res.status(200).json(comentarios || {});
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
