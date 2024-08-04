const http = require('http');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const app = require('./app');

const mongoURI = 'mongodb+srv://barretomarcylene:xlUWuniO9wcU0WiW@dataecom-next.az2uamu.mongodb.net/?retryWrites=true&w=majority&appName=DataEcom-Next';

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Conectado ao MongoDB com sucesso!');

    // Crie e inicie o servidor após a conexão com o MongoDB ser estabelecida
    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
});