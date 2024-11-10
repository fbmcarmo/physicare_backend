const mongoose = require("mongoose");

const fichaExercicioSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente", required: true },
  profissionalId: { type: mongoose.Schema.Types.ObjectId, ref: "Profissional", required: true },
  data_criacao: { type: Date, default: Date.now },
  exercicios: [
    {
      nome: String,
      tipo: String,
      series: Number,
      repeticoes: Number,
      intensidade: String,
      frequencia: String
    }
  ],
  observacoes: String
});

module.exports = mongoose.model("FichaExercicio", fichaExercicioSchema);
