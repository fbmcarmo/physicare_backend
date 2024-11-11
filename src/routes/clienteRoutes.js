const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rota para registrar um novo cliente
router.post("/register", clienteController.register);

// Rota para o login do cliente
router.post("/login", clienteController.login);

// Rota para atualizar o perfil do cliente autenticado
router.put("/me", authMiddleware, clienteController.updateCliente);

// Rota para excluir o perfil do cliente autenticado
router.delete("/me", authMiddleware, clienteController.deleteCliente);

// Rota para listar todos os clientes (admin ou com permissões específicas)
router.get("/", clienteController.listarClientes);

// Rota para obter os dados de um cliente específico por ID
router.get("/:id", clienteController.obterClientePorId);

module.exports = router;
