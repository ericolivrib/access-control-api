import e from 'express';
import router from './routes';
import handleError from './errors/handleError';
import logger from './utils/logger';

const app = e();

const PORT = process.env.SERVER_PORT;
const HOST = process.env.SERVER_HOST;

app.use(e.json());
app.use(router);
app.use(handleError);

app.listen(PORT, () => {
  logger.info(`Servidor rodando em http://${HOST}:${PORT}`);
});