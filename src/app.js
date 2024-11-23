const express = require("express");
const cors = require("cors");
const Cliente = require("./models/Cliente");
const Profissional = require("./models/Profissional");
const Ficha = require("./models/FichaExercicio");

const connectDB = require("./config/db");

const clienteRoutes = require("./routes/clienteRoutes");
const profissionalRoutes = require("./routes/profissionalRoutes");
const fichaRoutes = require("./routes/fichaRoutes");
const solicitacaoRoutes = require("./routes/solicitacaoRoutes");

const app = express();
app.use(express.json());

// Configurar o CORS para permitir requisições do frontend
const allowedOrigins = [
  'http://localhost:3001', 
  'http://localhost:3000',
  'http://localhost:8081'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // Permitir cookies
}));

// Conectar ao banco de dados
connectDB();

// Função para popular o banco de dados com dados iniciais
async function popularBanco() {
  try {
    const clientes = await Cliente.find();
    const profissionais = await Profissional.find();
    const fichas = await Ficha.find();

    let clienteId;
    let profissionalId;

    if (clientes.length === 0) {
      const cliente = new Cliente({
        nome: "João da Silva",
        email: "joao.silva@example.com",
        senha: "senhaSegura123",
        telefone: "11999999999",
        data_nascimento: "1990-01-01",
        objetivo: "Perder peso",
      });
      await cliente.save();
      clienteId = cliente._id;
      console.log("Cliente criado com sucesso");
    } else {
      clienteId = clientes[0]._id;
    }

    if (profissionais.length === 0) {
      const profissional = new Profissional({
        nome: "Ana Souza",
        email: "ana.souza@example.com",
        senha: "profissional123",
        especialidade: "Personal Trainer",
        telefone: "11988888888",
      });
      await profissional.save();
      profissionalId = profissional._id;
      console.log("Profissional criado com sucesso");
    } else {
      profissionalId = profissionais[0]._id;
    }

    if (fichas.length === 0 && clienteId && profissionalId) {
      const ficha = new Ficha({
        clienteId: clienteId,
        profissionalId: profissionalId,
        exercicios: [
          {
            nome: "Agachamento",
            series: 3,
            repeticoes: 15,
            intensidade: "Moderada",
            frequencia: "3 vezes por semana",
          },
          {
            nome: "Flexão de Braço",
            series: 3,
            repeticoes: 12,
            intensidade: "Alta",
            frequencia: "3 vezes por semana",
          },
        ],
      });
      await ficha.save();
      console.log("Ficha de exercício criada com sucesso");
    }
  } catch (error) {
    console.error("Erro ao popular o banco de dados:", error);
  }
}

// Registrar rotas
app.use("/clientes", clienteRoutes);
app.use("/profissionais", profissionalRoutes);
app.use("/fichas", fichaRoutes);
app.use("/solicitacoes", solicitacaoRoutes);

// Iniciar o servidor e popular o banco de dados
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  popularBanco();
});
