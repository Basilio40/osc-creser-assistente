/* ============================================================
   OSC CrêSer — Servidor para deploy (Railway)
   ------------------------------------------------------------
   Serve os arquivos estáticos da aplicação (index.html, css/,
   js/) na porta definida pela variável PORT (padrão do Railway).
   ============================================================ */

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// arquivos estáticos da aplicação
app.use(express.static(__dirname, { extensions: ["html"] }));

// qualquer rota desconhecida cai no index.html (app de página única)
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`OSC CrêSer — Assistente rodando na porta ${PORT}`);
});
