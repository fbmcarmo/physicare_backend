const express = require("express");
const router = express.Router();
const fichaController = require("../controllers/fichaController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, fichaController.createFicha);
router.get("/cliente/:clienteId", authMiddleware, fichaController.getFichasByCliente);
router.get("/:fichaId", authMiddleware, fichaController.getFichaById);

module.exports = router;
