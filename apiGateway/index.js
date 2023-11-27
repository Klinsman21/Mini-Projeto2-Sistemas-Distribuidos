const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3500;

app.use(express.json());
app.use(cors());

// Rota para obter os livros
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


// Rota para encaminhar solicitações para o serviço A
app.post('/serviceA/*', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3001' + req.url, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao acessar o serviço A' });
  }
});

// Rota para encaminhar solicitações para o serviço B
app.post('/serviceB/*', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3002' + req.url, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao acessar o serviço B' });
  }
});

// Inicializa o servidor na porta especificada
app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});
