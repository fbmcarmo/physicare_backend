const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", clienteController.register);
router.post("/login", clienteController.login);
router.put("/me", authMiddleware, clienteController.updateCliente); // Atualizar o próprio perfil
router.delete("/me", authMiddleware, clienteController.deleteCliente); // Deletar o próprio perfil

module.exports = router;
