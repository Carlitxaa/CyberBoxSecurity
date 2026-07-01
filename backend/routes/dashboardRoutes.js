const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /dashboard/atividade-recente
router.get("/atividade-recente", async (req, res) => {
  try {
    const atividades = [];

    // Utilizadores recentes
    try {
      const utilizadores = await db.query(
        `SELECT nome, data_criacao FROM utilizadores WHERE data_criacao IS NOT NULL ORDER BY data_criacao DESC LIMIT 5`
      );
      utilizadores.rows.forEach((row) => {
        atividades.push({
          tipo: "utilizador",
          titulo: "Novo utilizador registado",
          descricao: row.nome || "Utilizador",
          data: row.data_criacao,
          icon: "FaUserPlus",
          color: "#BDF4C8",
        });
      });
    } catch (err) {
      console.error("Erro ao buscar utilizadores:", err);
    }

    // Documentos recentes
    try {
      const documentos = await db.query(
        `SELECT titulo, data_upload FROM documentos WHERE data_upload IS NOT NULL ORDER BY data_upload DESC LIMIT 5`
      );
      documentos.rows.forEach((row) => {
        atividades.push({
          tipo: "documento",
          titulo: "Novo documento enviado",
          descricao: row.titulo || "Documento",
          data: row.data_upload,
          icon: "FaFileAlt",
          color: "#C7EFFF",
        });
      });
    } catch (err) {
      console.error("Erro ao buscar documentos:", err);
    }

    // Pedidos recentes
    try {
      const pedidos = await db.query(
        `SELECT titulo, data_criacao FROM pedidos WHERE data_criacao IS NOT NULL ORDER BY data_criacao DESC LIMIT 5`
      );
      pedidos.rows.forEach((row) => {
        atividades.push({
          tipo: "pedido",
          titulo: "Novo pedido criado",
          descricao: row.titulo || "Pedido",
          data: row.data_criacao,
          icon: "FaExclamationTriangle",
          color: "#FFE5BE",
        });
      });
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
    }

    // Artigos recentes (se existir tabela)
    try {
      const artigos = await db.query(
        `SELECT titulo, data_criacao FROM artigos WHERE data_criacao IS NOT NULL ORDER BY data_criacao DESC LIMIT 5`
      );
      artigos.rows.forEach((row) => {
        atividades.push({
          tipo: "artigo",
          titulo: "Artigo Publicado",
          descricao: row.titulo || "Artigo",
          data: row.data_criacao,
          icon: "FaShieldAlt",
          color: "#E7D5FF",
        });
      });
    } catch (err) {
      console.error("Erro ao buscar artigos:", err);
    }

    // Ordenar por data descrescente e pegar os 4 mais recentes
    const atividadesOrdenadas = atividades
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .slice(0, 4);

    res.json(atividadesOrdenadas);
  } catch (error) {
    console.error("Erro geral ao buscar atividade recente:", error);
    res.status(500).json({ error: "Erro ao buscar atividade recente" });
  }
});

// GET /dashboard/estado-sistema
router.get("/estado-sistema", async (req, res) => {
  try {
    // Pedidos pendentes
    const pedidosPendentes = await db.query(
      `SELECT COUNT(*) as count FROM pedidos WHERE estado != 'Resolvido'`
    );

    // Documentos ativos
    const documentosAtivos = await db.query(
      `SELECT COUNT(*) as count FROM documentos`
    );

    // Utilizadores ativos
    const utilizadoresAtivos = await db.query(
      `SELECT COUNT(*) as count FROM utilizadores`
    );

    res.json({
      pedidosPendentes: parseInt(pedidosPendentes.rows[0].count),
      documentosAtivos: parseInt(documentosAtivos.rows[0].count),
      utilizadoresAtivos: parseInt(utilizadoresAtivos.rows[0].count),
      sistema: "Online",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar estado do sistema" });
  }
});

module.exports = router;
