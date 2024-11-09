const express = require("express");
const connectDB = require("./config/db");
const clienteRoutes = require("./routes/clienteRoutes");

connectDB();

const app = express();
app.use(express.json());
app.use("/clientes", clienteRoutes);

module.exports = app;
