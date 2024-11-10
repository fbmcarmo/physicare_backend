const FichaExercicio = require("../models/FichaExercicio");

// Criar ficha de exercício
exports.createFicha = async (req, res) => {
  try {
    const { clienteId, exercicios, observacoes } = req.body;
    const ficha = new FichaExercicio({
      clienteId,
      profissionalId: req.user.id, // ID do profissional autenticado
      exercicios,
      observacoes
    });
    await ficha.save();
    res.status(201).json(ficha);
  } catch (err) {
    res.status(400).json({ message: "Erro ao criar ficha de exercício", err });
  }
};

// Obter fichas de um cliente específico
exports.getFichasByCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const fichas = await FichaExercicio.find({ clienteId }).populate("profissionalId", "nome");
    res.json(fichas);
  } catch (err) {
    res.status(400).json({ message: "Erro ao obter fichas de exercício", err });
  }
};

// Obter uma ficha específica por ID
exports.getFichaById = async (req, res) => {
  try {
    const ficha = await FichaExercicio.findById(req.params.fichaId).populate("profissionalId", "nome");
    if (!ficha) return res.status(404).json({ message: "Ficha de exercício não encontrada" });
    res.json(ficha);
  } catch (err) {
    res.status(400).json({ message: "Erro ao obter ficha de exercício", err });
  }
};

// Atualizar ficha de exercício (restrito ao profissional que a criou)
exports.updateFicha = async (req, res) => {
  try {
    const { fichaId } = req.params;
    const updates = req.body;

    const ficha = await FichaExercicio.findOneAndUpdate(
      { _id: fichaId, profissionalId: req.user.id }, // Verifica se o profissional é o criador da ficha
      updates,
      { new: true }
    );

    if (!ficha) return res.status(404).json({ message: "Ficha de exercício não encontrada ou acesso não autorizado" });
    res.json(ficha);
  } catch (err) {
    res.status(400).json({ message: "Erro ao atualizar ficha de exercício", err });
  }
};

// Deletar ficha de exercício (restrito ao profissional que a criou)
exports.deleteFicha = async (req, res) => {
  try {
    const { fichaId } = req.params;

    const ficha = await FichaExercicio.findOneAndDelete({
      _id: fichaId,
      profissionalId: req.user.id // Verifica se o profissional é o criador da ficha
    });

    if (!ficha) return res.status(404).json({ message: "Ficha de exercício não encontrada ou acesso não autorizado" });
    res.json({ message: "Ficha de exercício deletada com sucesso" });
  } catch (err) {
    res.status(400).json({ message: "Erro ao deletar ficha de exercício", err });
  }
};