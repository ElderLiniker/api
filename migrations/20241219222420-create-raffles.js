module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('raffles', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      selected: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      buyer: {
        type: Sequelize.STRING,
        allowNull: true
      },
      paid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('raffles');
  }
};
