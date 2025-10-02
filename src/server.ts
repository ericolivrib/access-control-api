import e from 'express';
import router from './routes';
import handleError from './errors/handleError';
import logger from './utils/logger';
import { environment } from './schemas/env.schema';
import { createModelAssociations } from './models/associations';
import { accessService } from './services/access.service';

const app = e();

const PORT = environment.SERVER_PORT;
const HOST = environment.SERVER_HOST;

app.use(e.json());
app.use(router);
app.use(handleError);

app.listen(PORT, (err) => {
  if (err) {
    logger.error(err, 'Erro ao iniciar o servidor');
    process.exit(1);
  }
  logger.info(`Servidor rodando em http://${HOST}:${PORT}`);

  createModelAssociations();
  accessService.restoreAccessExpirations();

});