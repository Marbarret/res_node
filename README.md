# Curso API
Estrutura do Projeto
O projeto está organizado de acordo com a arquitetura de camadas, dividindo a lógica de negócio, controladores, rotas e configuração do servidor:

Copiar código
/src
  /services
    courseService.js          # Lógica de negócios e interações com o banco de dados
  /controllers
    courseController.js       # Controladores que gerenciam as requisições e respostas HTTP
  /routes
    course.js                 # Definição das rotas e seu mapeamento para os controladores
  /config
    database.js               # Configuração da conexão com o banco de dados
app.js                        # Configuração e inicialização do servidor Express
server.js                     # Arquivo principal do servidor
app.js

Função: Configura o servidor Express, incluindo middlewares como morgan para logging, body-parser para processamento de JSON, e configurações de CORS. Também gerencia a conexão com o MongoDB e lida com erros.
/services/courseService.js
Função: Contém a lógica de negócios e a interação direta com o banco de dados. Aqui são realizadas operações como buscar, criar, atualizar e deletar cursos.
/controllers/courseController.js
Função: Responsável por receber as requisições HTTP, interagir com o courseService, e enviar as respostas apropriadas ao cliente.
/routes/course.js
Função: Define as rotas da API, associando cada rota a um método do controlador.
/config/database.js
Função: Contém a função de configuração para obter a coleção do banco de dados MongoDB.
server.js
Função: Arquivo principal do servidor. Configura o servidor Express e inicia a aplicação.
Requisitos
Node.js (v12 ou superior)
MongoDB (local ou em uma nuvem)
npm ou yarn