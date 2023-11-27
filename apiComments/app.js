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


// Inicializa o servidor na porta especificada
app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});
