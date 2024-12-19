const mongoose = require('mongoose');

// Definindo o esquema para os números
const numberSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  selected: { type: Boolean, default: false },
  buyer: { type: String, default: '' },
  paid: { type: Boolean, default: false },
});

// Criando o modelo Number
const Number = mongoose.model('Number', numberSchema);

module.exports = Number;

