const Profissional = require("../models/Profissional");
const jwt = require("jsonwebtoken");

// Registro de profissional
exports.register = async (req, res) => {
  try {
    const { nome, email, senha, telefone, especialidades } = req.body;
    const profissional = new Profissional({ nome, email, senha, telefone, especialidades });
    await profissional.save();
    res.status(201).json(profissional);
  } catch (err) {
    res.status(400).json({ message: "Erro ao registrar profissional", err });
  }
};

// Login do profissional
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const profissional = await Profissional.findOne({ email });
    if (!profissional || !(await profissional.verificarSenha(senha))) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const token = jwt.sign({ id: profissional._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: "Erro ao fazer login", err });
  }
};

// Obter lista de clientes do profissional
exports.getClientes = async (req, res) => {
  try {
    const profissional = await Profissional.findById(req.user.id).populate("clientes");
    res.json(profissional.clientes);
  } catch (err) {
    res.status(400).json({ message: "Erro ao obter clientes", err });
  }
};

exports.updateProfissional = async (req, res) => {
  try {
    const updates = req.body;
    const profissional = await Profissional.findByIdAndUpdate(req.user.id, updates, { new: true });
    if (!profissional) return res.status(404).json({ message: "Profissional não encontrado" });
    res.json(profissional);
  } catch (err) {
    res.status(400).json({ message: "Erro ao atualizar profissional", err });
  }
};

// Deletar o profissional autenticado
exports.deleteProfissional = async (req, res) => {
  try {
    const profissional = await Profissional.findByIdAndDelete(req.user.id);
    if (!profissional) return res.status(404).json({ message: "Profissional não encontrado" });
    res.json({ message: "Profissional deletado com sucesso" });
  } catch (err) {
    res.status(400).json({ message: "Erro ao deletar profissional", err });
  }
};

exports.listarProfissionais = async (req, res) => {
  try {
    const profissionais = await Profissional.find();
    res.json(profissionais);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar profissionais" });
  }
};

// Obter profissional por ID
exports.obterProfissionalPorId = async (req, res) => {
  try {
    const profissional = await Profissional.findById(req.params.id).select("-senha"); // Oculta a senha
    if (!profissional) {
      return res.status(404).json({ message: "Profissional não encontrado" });
    }
    res.json(profissional);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter profissional" });
  }
};
