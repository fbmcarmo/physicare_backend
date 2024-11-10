const express = require("express");
const router = express.Router();
const profissionalController = require("../controllers/profissionalController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", profissionalController.register);
router.post("/login", profissionalController.login);
router.get("/clientes", authMiddleware, profissionalController.getClientes);

module.exports = router;
