const http = require('http');
const app = require('./app');
const { connectToDatabase } = require('./db');
const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectToDatabase();

    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
  }
}

startServer().catch(console.dir);