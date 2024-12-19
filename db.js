const { Sequelize } = require('sequelize');

// Configuração da conexão com o PostgreSQL
const sequelize = new Sequelize('raffle_db', 'POSTGRES' ,'postgres', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,  // A porta padrão do PostgreSQL
    logging: false, // Desativa o log SQL
});

// Teste a conexão com o banco de dados
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados foi bem-sucedida!');
    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados:', error);
    }
}

testConnection();

module.exports = sequelize;
