const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'yourpassword',
  database: process.env.DB_NAME || 'raffle_db',
  host: process.env.DB_HOST || 'db',
  dialect: 'postgres'
});

// Testando a conexão
sequelize.authenticate().then(() => {
  console.log('Conexão com o banco de dados estabelecida com sucesso.');
}).catch((err) => {
  console.error('Erro ao conectar ao banco de dados:', err);
});

module.exports = { sequelize, DataTypes };
