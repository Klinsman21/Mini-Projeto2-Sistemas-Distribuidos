const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3500;

app.use(express.json());
app.use(cors());

app.get('/search/:book', async (req, res) => {
  const { book } = req.params;
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${book}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao acessar a API externa' });
  }
});

app.get('/details/:book', async (req, res) => {
  const { book } = req.params;
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${book}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao acessar a API externa' });
  }
});


app.post('/comment/:book', async (req, res) => {
  const { book } = req.params;

  try {
    const response = await axios.post(`http://localhost:3300/comments/${book}`, req.body);
    console.log(response.data)
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao acessar o serviço A' });
  }
});


app.get('/comments/:book', async (req, res) => {
  const { book } = req.params;
  try {
    const response = await axios.get(`http://localhost:3300/comments/${book}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao acessar a API externa' });
  }
});
a
app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});
