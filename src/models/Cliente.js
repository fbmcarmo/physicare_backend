const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
  telefone: String,
  idade: Number,
  sexo: String,
  altura: Number,
  peso: Number,
  perimetria: {
    braco: Number,
    cintura: Number,
    coxa: Number,
  },
  anamnese: {
    condicoes: [String],
    objetivos: [String],
  },
  fichas: [{ type: mongoose.Schema.Types.ObjectId, ref: "FichaExercicio" }]
});

module.exports = mongoose.model("Cliente", clienteSchema);
