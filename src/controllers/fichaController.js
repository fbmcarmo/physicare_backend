const FichaExercicio = require("../models/FichaExercicio");
const Solicitacao = require("../models/Solicitacao");

// Criar ficha de exercício
exports.createFicha = async (req, res) => {
  try {
    const { clienteId, exercicios, observacoes } = req.body;
    const profissionalId = req.user.id;

    // Verificar se a solicitação foi aceita
    const solicitacao = await Solicitacao.findOne({
      clienteId,
      profissionalId,
      status: "Aceito" // A solicitação deve estar com status "Aceito"
    });

    if (!solicitacao) {
      return res.status(400).json({ message: "Solicitação não foi aceita ou não encontrada." });
    }

    // Criar a ficha de exercício se a solicitação foi aceita
    const ficha = new FichaExercicio({
      clienteId,
      profissionalId,
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

exports.getFichasByProfissional = async (req, res) => {
  try {
    const { profissionalId } = req.params; // ID do profissional enviado pela URL
    // Encontrar fichas associadas ao profissional
    const fichas = await FichaExercicio.find({ profissionalId })
      .populate("profissionalId", "nome"); // Populando o nome do profissional

    if (!fichas) {
      return res.status(404).json({ message: "Nenhuma ficha encontrada para este profissional." });
    }

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
    const profissionalId = req.user.id;

    // Obter a ficha de exercício
    const ficha = await FichaExercicio.findById(fichaId);

    // Verificar se a ficha existe
    if (!ficha) {
      return res.status(404).json({ message: "Ficha de exercício não encontrada." });
    }

    // Verificar se o profissional que está tentando editar é o criador da ficha
    if (ficha.profissionalId.toString() !== profissionalId.toString()) {
      return res.status(403).json({ message: "Acesso não autorizado. Você não é o criador desta ficha." });
    }

    // Verificar se a solicitação relacionada à ficha tem status "Aceito"
    const solicitacao = await Solicitacao.findOne({
      clienteId: ficha.clienteId,
      profissionalId,
      status: "Aceito"
    });

    if (!solicitacao) {
      return res.status(400).json({ message: "A solicitação não foi aceita ou não encontrada." });
    }

    // Atualizar a ficha se a solicitação estiver "Aceita"
    const updatedFicha = await FichaExercicio.findByIdAndUpdate(fichaId, updates, { new: true });
    res.json(updatedFicha);
  } catch (err) {
    res.status(400).json({ message: "Erro ao atualizar ficha de exercício", err });
  }
};


// Deletar ficha de exercício (restrito ao profissional que a criou)
exports.deleteFicha = async (req, res) => {
  try {
    const { fichaId } = req.params;
    const profissionalId = req.user.id;

    // Obter a ficha de exercício
    const ficha = await FichaExercicio.findById(fichaId);

    // Verificar se a ficha existe
    if (!ficha) {
      return res.status(404).json({ message: "Ficha de exercício não encontrada." });
    }

    // Verificar se o profissional que está tentando deletar é o criador da ficha
    if (ficha.profissionalId.toString() !== profissionalId.toString()) {
      return res.status(403).json({ message: "Acesso não autorizado. Você não é o criador desta ficha." });
    }

    // Verificar se a solicitação relacionada à ficha tem status "Aceito"
    const solicitacao = await Solicitacao.findOne({
      clienteId: ficha.clienteId,
      profissionalId,
      status: "Aceito"
    });

    if (!solicitacao) {
      return res.status(400).json({ message: "A solicitação não foi aceita ou não encontrada." });
    }

    // Deletar a ficha se a solicitação estiver "Aceita"
    await FichaExercicio.findByIdAndDelete(fichaId);
    res.json({ message: "Ficha de exercício deletada com sucesso." });
  } catch (err) {
    res.status(400).json({ message: "Erro ao deletar ficha de exercício", err });
  }
};

exports.listarFichas = async (req, res) => {
  try {
    const fichas = await FichaExercicio.find();
    res.json(fichas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar fichas", error });
  }
};
