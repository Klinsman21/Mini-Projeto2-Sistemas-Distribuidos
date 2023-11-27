const express = require('express');
const redis = require('redis');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());

const client = redis.createClient({
  host: 'localhost',
  port: 6379, 
});


app.use(bodyParser.json());

app.post('/comments/:bookID', (req, res) => {
  const { bookID } = req.params;
  const { autor, comment, postDate } = req.body;
  
  const newComment = {
    autor,
    comment,
    postDate: postDate || new Date().toISOString().split('T')[0],
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

app.get('/comments/:livroId', (req, res) => {
  const { livroId } = req.params;

  client.lrange(livroId, 0, -1, (err, reply) => {
    if (err) {
      console.error(err);
    } else {
      res.status(200).json(reply);
    }
  });
});

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
