const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());

const client = redis.createClient({
  host: 'localhost', // Substitua pelo seu host do Redis
  port: 6379, // Substitua pela porta do seu servidor do Redis
});


app.use(bodyParser.json());

// Endpoint para adicionar um comentário
app.post('/comments/:bookID', (req, res) => {
  const { bookID } = req.params;
  const { autor, comment, postDate } = req.body; // Adicionando postDate ao JSON enviado pelo cliente
  
  const newComment = {
    autor,
    comment,
    postDate: postDate || new Date().toISOString().split('T')[0], // Usando postDate enviado ou gerando um novo
  };

  console.log("ok");

  client.rpush(bookID, JSON.stringify(newComment), (err, reply) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao adicionar comentário');
    } else {
      res.status(201).send('Comentário adicionado com sucesso');
    }
  });
});


// Defina a porta em que o servidor irá escutar

// Endpoint para obter todos os comentários de um livro
app.get('/comments/:livroId', (req, res) => {
  const { livroId } = req.params;

  // client.get(livroId, (err, comentarios) => {
  //   if (err) {
  //     console.error(err);
  //     res.status(500).send('Erro ao obter comentários');
  //   } else {
  //     let data = JSON.parse(comentarios)
  //     res.status(200).json(data || {});
  //   }
  // });
  client.lrange(livroId, 0, -1, (err, reply) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Elementos da lista:');
      // console.log(reply); // `reply` conterá os elementos da lista
      res.status(200).json(reply);
      reply.forEach(element => {
        console.log(JSON.parse(element).autor);
      });
    }
  });
});

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
