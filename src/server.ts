import e from 'express';
import router from './routes';
import handleError from './errors/handleError';

const app = e();

const PORT = process.env.SERVER_PORT || 3000;
const HOST = process.env.SERVER_HOST || 'localhost';

app.use(e.json());
app.use(router);
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});