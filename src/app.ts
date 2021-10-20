import 'dotenv/config' // Para ler o file .env
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

import { router } from './routes';

const app = express();
app.use(cors());

// Cria o servidor http para ser usado no socket.io
const serverHttp = http.createServer(app);

// Cria o socket passando o cors para informar quais apps terão acesso a API
const io = new Server(serverHttp, {
  cors: {
    origin: '*',
  }
});

// Cria um listen para ouvir as conexões de usuários na app
// Sempre que um usuário logar na app ele estará ouvindo as comunicações desse user
io.on('connection', (socket) => {
  console.log(`Usuário conectado no socket ${socket.id}`);
});

app.use(express.json());
app.use(router);

app.get('/github', (request, response) => {
  response.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
});

app.get('/signin/callback', (request, response) => {
  const { code } = request.query;

  return response.json(code);
});

export { serverHttp, io }