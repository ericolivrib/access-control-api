import { Sequelize } from 'sequelize';
import logger from './utils/logger';

const datasource = new Sequelize('sqlite:memory:', {
  logging: (msg) => logger.debug(msg),
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