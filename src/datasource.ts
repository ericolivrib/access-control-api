import { Sequelize } from 'sequelize';
import logger from './utils/logger';
import { environment } from './schemas/env.schema';

const datasource = new Sequelize(environment.DATABASE_URL, {
  logging: (msg) => logger.debug(msg),
  sync: { alter: true }
});

export async function connect() {
  try {
    await datasource.authenticate();
    logger.info('Conexão estabelecida com sucesso.');
  } catch (error) {
    logger.error('Falha na conexão com a base de dados');
  }
}

export default datasource;