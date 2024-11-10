const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const profissionalSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  telefone: String,
  especialidades: [String],
  clientes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cliente" }]
});

// criptografar a senha antes de salvar
profissionalSchema.pre("save", async function (next) {
  if (!this.isModified("senha")) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

// Método para verificar a senha
profissionalSchema.methods.verificarSenha = async function (senha) {
  return bcrypt.compare(senha, this.senha);
};

module.exports = mongoose.model("Profissional", profissionalSchema);
