const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticateToken } = require("../middleware/auth");
const { scopedClientWhere } = require("../utils/accessControl");

router.use(authenticateToken);

// GET /dashboard/atividade-recente
router.get("/atividade-recente", async (req, res) => {
  try {
    const atividades = [];
    const scope = scopedClientWhere(req.user);

    // Utilizadores recentes
    try {
      const utilizadores = req.user.tipo === "Administrador"
        ? await db.query(
            `SELECT nome, data_criacao FROM utilizadores WHERE data_criacao IS NOT NULL ORDER BY data_criacao DESC LIMIT 5`
          )
        : await db.query(
            `SELECT nome, data_criacao FROM utilizadores WHERE tipo = 'Cliente' AND gestor_id = $1 AND data_criacao IS NOT NULL ORDER BY data_criacao DESC LIMIT 5`,
            [req.user.id]
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
      const documentosWhere = scope.clause
        ? `WHERE ${scope.clause} AND data_upload IS NOT NULL`
        : `WHERE data_upload IS NOT NULL`;
      const documentos = await db.query(
        `SELECT nome AS titulo, data_upload FROM documentos ${documentosWhere} ORDER BY data_upload DESC LIMIT 5`,
        scope.values
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
      const pedidosWhere = scope.clause
        ? `WHERE ${scope.clause} AND data_criacao IS NOT NULL`
        : `WHERE data_criacao IS NOT NULL`;
      const pedidos = await db.query(
        `SELECT titulo, data_criacao FROM pedidos ${pedidosWhere} ORDER BY data_criacao DESC LIMIT 5`,
        scope.values
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
    const scope = scopedClientWhere(req.user);
    const scopeWhere = scope.clause ? `WHERE ${scope.clause}` : "";
    const pendingWhere = scope.clause
      ? `WHERE ${scope.clause} AND estado != 'Resolvido'`
      : `WHERE estado != 'Resolvido'`;

    const pedidosPendentes = await db.query(
      `SELECT COUNT(*) as count FROM pedidos ${pendingWhere}`,
      scope.values
    );

    const totalPedidos = await db.query(
      `SELECT COUNT(*) as count FROM pedidos ${scopeWhere}`,
      scope.values
    );

    const documentosAtivos = await db.query(
      `SELECT COUNT(*) as count FROM documentos ${scopeWhere}`,
      scope.values
    );

    const utilizadoresAtivos = req.user.tipo === "Administrador"
      ? await db.query(`SELECT COUNT(*) as count FROM utilizadores`)
      : await db.query(
          `SELECT COUNT(*) as count FROM utilizadores WHERE tipo = 'Cliente' AND gestor_id = $1`,
          [req.user.id]
        );

    const artigosPublicados = await db.query(
      `SELECT COUNT(*) as count FROM artigos WHERE estado = 'Publicado'`
    );

    res.json({
      pedidosPendentes: parseInt(pedidosPendentes.rows[0].count),
      totalPedidos: parseInt(totalPedidos.rows[0].count),
      documentosAtivos: parseInt(documentosAtivos.rows[0].count),
      utilizadoresAtivos: parseInt(utilizadoresAtivos.rows[0].count),
      artigosPublicados: parseInt(artigosPublicados.rows[0].count),
      sistema: "Online",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar estado do sistema" });
  }
});

module.exports = router;
