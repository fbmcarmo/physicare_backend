const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const clienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  telefone: String,
  data_nascimento: Date,
  objetivo: String
});

// Middleware para criptografar a senha antes de salvar
clienteSchema.pre("save", async function (next) {
  if (!this.isModified("senha")) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

// Método para verificar a senha
clienteSchema.methods.verificarSenha = async function (senha) {
  return bcrypt.compare(senha, this.senha);
};

module.exports = mongoose.model("Cliente", clienteSchema);
