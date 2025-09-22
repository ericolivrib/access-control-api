import { Sequelize } from 'sequelize';

const datasource = new Sequelize('sqlite:memory:');

export async function connect() {
  try {
    await datasource.authenticate();
    console.log('Conexão estabelecida com sucesso.');
  } catch (error) {
    console.error('Falha na conexão com a base de dados:', error);
  }
}

export default datasource;