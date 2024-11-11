const mongoose = require("mongoose");

const solicitacaoSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true,
  },
  profissionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profissional",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pendente", "Aceito", "Rejeitado", "Finalizado"],
    default: "Pendente",
  },
  dataSolicitacao: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Solicitacao", solicitacaoSchema);
