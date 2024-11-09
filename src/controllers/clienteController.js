const Cliente = require("../models/Cliente");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10);
    const cliente = new Cliente({ nome, email, senha: hashedPassword });
    await cliente.save();
    res.status(201).json(cliente);
  } catch (err) {
    res.status(400).json({ message: "Erro ao criar cliente", err });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const cliente = await Cliente.findOne({ email });
    if (!cliente || !(await bcrypt.compare(senha, cliente.senha))) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const token = jwt.sign({ id: cliente._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: "Erro ao fazer login", err });
  }
};
    