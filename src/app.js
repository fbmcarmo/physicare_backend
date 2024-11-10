const express = require("express");
const connectDB = require("./config/db");

const clienteRoutes = require("./routes/clienteRoutes");
const profissionalRoutes = require("./routes/profissionalRoutes");
const fichaRoutes = require("./routes/fichaRoutes");

connectDB();

const app = express();
app.use(express.json());

app.use("/clientes", clienteRoutes);
app.use("/profissionais", profissionalRoutes);
app.use("/fichas", fichaRoutes);

module.exports = app;

