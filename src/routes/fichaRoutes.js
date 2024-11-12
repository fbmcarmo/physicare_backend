const express = require("express");
const router = express.Router();
const fichaController = require("../controllers/fichaController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, fichaController.createFicha);
router.get("/clientes/:clienteId", fichaController.getFichasByCliente);
router.get("/profissionais/:profissionalId", fichaController.getFichasByProfissional);
router.get("/:fichaId", fichaController.getFichaById);
router.get("/", fichaController.listarFichas);
router.put("/:fichaId", authMiddleware, fichaController.updateFicha); // Atualizar ficha
router.delete("/:fichaId", authMiddleware, fichaController.deleteFicha); // Deletar ficha

module.exports = router;
