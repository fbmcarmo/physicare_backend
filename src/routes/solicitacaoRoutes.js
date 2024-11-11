const express = require("express");
const router = express.Router();
const solicitacaoController = require("../controllers/solicitacaoController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rota para solicitar apoio
router.post("/solicitar", authMiddleware, solicitacaoController.solicitarApoio);

// Rota para aceitar uma solicitação
router.put("/aceitar/:solicitacaoId", authMiddleware, solicitacaoController.aceitarSolicitacao);

// Rota para rejeitar uma solicitação
router.put("/rejeitar/:solicitacaoId", authMiddleware, solicitacaoController.rejeitarSolicitacao);

// Rota para listar todas as solicitações
router.get("/", authMiddleware, solicitacaoController.listarSolicitacoes);

// Rota para listar solicitações de um usuário específico
router.get("/usuario/:usuarioId", authMiddleware, solicitacaoController.listarSolicitacoesPorUsuario);

// Rota para obter detalhes de uma solicitação específica
router.get("/:id", authMiddleware, solicitacaoController.obterSolicitacaoPorId);

// Rota para finalizar o contato com profissional
router.put("/finalizar/:solicitacaoId", authMiddleware, solicitacaoController.finalizarContato);

module.exports = router;
