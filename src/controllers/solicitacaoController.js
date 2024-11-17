const Solicitacao = require("../models/Solicitacao");
const Profissional = require("../models/Profissional");
const Cliente = require("../models/Cliente");
const Ficha = require("../models/FichaExercicio");

// Solicitar Apoio
async function solicitarApoio(req, res) {
  const { profissionalId } = req.body;
  const clienteId = req.user.id; //o ID do cliente vem do JWT

  try {
    // Verificar se já existe uma solicitação pendente ou aceita para esse profissional e cliente
    const solicitacaoExistente = await Solicitacao.findOne({
      clienteId,
      profissionalId,
      $or: [{ status: "Pendente" }, { status: "Aceito" }]
    });

    if (solicitacaoExistente) {
      return res.status(400).json({ message: "Já existe uma solicitação pendente ou aceita para este profissional." });
    }

    // Caso contrário, criar uma nova solicitação
    const novaSolicitacao = new Solicitacao({
      clienteId,
      profissionalId,
    });

    await novaSolicitacao.save();
    res.status(201).json({ message: "Solicitação enviada com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao enviar solicitação." });
  }
}

// Aceitar Solicitação
async function aceitarSolicitacao(req, res) {
  const { solicitacaoId } = req.params;
  const profissionalId = req.user.id; //o ID do profissional a partir do JWT

  try {
    const solicitacao = await Solicitacao.findById(solicitacaoId);

    if (!solicitacao) {
      return res.status(404).json({ error: "Solicitação não encontrada." });
    }

    if (solicitacao.profissionalId.toString() !== profissionalId.toString()) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    solicitacao.status = "Aceito";
    await solicitacao.save();

    // Criar a ficha de exercício
    const ficha = new Ficha({
      clienteId: solicitacao.clienteId,
      profissionalId,
      exercicios: [],
      anamnese: "", // O profissional pode adicionar a anamnese depois
    });

    await ficha.save();
    res.status(200).json({ message: "Solicitação aceita e ficha criada." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao aceitar solicitação." });
  }
}

// Rejeitar Solicitação
async function rejeitarSolicitacao(req, res) {
  const { solicitacaoId } = req.params;
  const profissionalId = req.user.id;

  try {
    const solicitacao = await Solicitacao.findById(solicitacaoId);

    if (!solicitacao) {
      return res.status(404).json({ error: "Solicitação não encontrada." });
    }

    if (solicitacao.profissionalId.toString() !== profissionalId.toString()) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    // Usar deleteOne() em vez de remove()
    await solicitacao.deleteOne();

    // Deletar as fichas associadas
    await Ficha.deleteMany({
      clienteId: solicitacao.clienteId,
      profissionalId: solicitacao.profissionalId
    });

    res.status(200).json({ message: "Solicitação rejeitada e fichas deletadas." });
  } catch (error) {
    console.error("Erro ao rejeitar solicitação:", error);
    res.status(500).json({ error: "Erro ao rejeitar solicitação." });
  }
}


// Listar todas as solicitações
async function listarSolicitacoes(req, res) {
  try {
    const solicitacoes = await Solicitacao.find();
    res.json(solicitacoes);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar solicitações" });
  }
}

// Listar solicitações pertinentes a um usuário específico (cliente ou profissional)
async function listarSolicitacoesPorUsuario(req, res) {
  try {
    const { usuarioId } = req.params; // ID do cliente ou profissional
    const solicitacoes = await Solicitacao.find({
      $or: [
        { clienteId: usuarioId },
        { profissionalId: usuarioId }
      ]
    });
    res.json(solicitacoes);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar solicitações para o usuário" });
  }
}

// Obter uma solicitação específica por ID
async function obterSolicitacaoPorId(req, res) {
  try {
    const solicitacao = await Solicitacao.findById(req.params.id);
    if (!solicitacao) {
      return res.status(404).json({ message: "Solicitação não encontrada" });
    }
    res.json(solicitacao);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter solicitação" });
  }
}

async function finalizarContato(req, res) {
  const { solicitacaoId } = req.params;
  const profissionalId = req.user.id; // Profissional autenticado

  try {
    const solicitacao = await Solicitacao.findById(solicitacaoId);

    if (!solicitacao) {
      return res.status(404).json({ error: "Solicitação não encontrada." });
    }

    if (solicitacao.profissionalId.toString() !== profissionalId.toString()) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    // Alterar o status para "Finalizado"
    solicitacao.status = "Finalizado";
    await solicitacao.save();

    // Deletar a solicitação
    await solicitacao.deleteOne();

    // Deletar as fichas associadas
    await Ficha.deleteMany({
      clienteId: solicitacao.clienteId,
      profissionalId: solicitacao.profissionalId
    });

    res.status(200).json({ message: "Contato finalizado e fichas deletadas." });
  } catch (error) {
    console.error("Erro ao finalizar o contato:", error);
    res.status(500).json({ error: "Erro ao finalizar o contato." });
  }
}


module.exports = {
  solicitarApoio,
  aceitarSolicitacao,
  rejeitarSolicitacao,
  listarSolicitacoes,
  listarSolicitacoesPorUsuario,
  obterSolicitacaoPorId,
  finalizarContato
};
