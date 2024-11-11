const Cliente = require("../models/Cliente");
const jwt = require("jsonwebtoken");

// Registro de cliente
exports.register = async (req, res) => {
  try {
    const { nome, email, senha, telefone, data_nascimento, objetivo } = req.body;
    const cliente = new Cliente({ nome, email, senha, telefone, data_nascimento, objetivo });
    await cliente.save();
    res.status(201).json(cliente);
  } catch (err) {
    res.status(400).json({ message: "Erro ao registrar cliente", err });
  }
};

// Login do cliente
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const cliente = await Cliente.findOne({ email });
    if (!cliente || !(await cliente.verificarSenha(senha))) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const token = jwt.sign({ id: cliente._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: "Erro ao fazer login", err });
  }
};

// Atualizar informações do cliente autenticado
exports.updateCliente = async (req, res) => {
  try {
    const updates = req.body;
    const cliente = await Cliente.findByIdAndUpdate(req.user.id, updates, { new: true });
    if (!cliente) return res.status(404).json({ message: "Cliente não encontrado" });
    res.json(cliente);
  } catch (err) {
    res.status(400).json({ message: "Erro ao atualizar cliente", err });
  }
};

// Deletar o cliente autenticado
exports.deleteCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.user.id);
    if (!cliente) return res.status(404).json({ message: "Cliente não encontrado" });
    res.json({ message: "Cliente deletado com sucesso" });
  } catch (err) {
    res.status(400).json({ message: "Erro ao deletar cliente", err });
  }
};

exports.listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar clientes" });
  }
};

// Obter cliente por ID
exports.obterClientePorId = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id).select("-senha"); // Oculta a senha
    if (!cliente) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter cliente" });
  }
};