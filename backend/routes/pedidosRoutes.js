const fs = require("fs");
const path = require("path");
const multer = require("multer");
const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  canAccessClient,
  getClientById,
  scopedClientWhere,
} = require("../utils/accessControl");

const router = express.Router();
const db = require("../config/db");

const uploadsPath = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadsPath, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsPath,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/public", async (req, res) => {
  try {
    const {
      titulo,
      categoria,
      prioridade,
      estado,
      descricao,
      cliente,
      respostas,
      historico_respostas,
    } = req.body;

    const result = await db.query(
      `
      INSERT INTO pedidos
      (
        titulo,
        categoria,
        prioridade,
        estado,
        descricao,
        cliente,
        cliente_id,
        respostas,
        historico_respostas,
        ficheiro
      )
      VALUES
      ($1, $2, $3, $4, $5, $6, NULL, $7, $8, NULL)
      RETURNING *
      `,
      [
        titulo,
        categoria || "Contacto Geral",
        prioridade || "Normal",
        estado || "Pendente",
        descricao,
        cliente,
        respostas ?? 0,
        JSON.stringify(historico_respostas ?? []),
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar pedido" });
  }
});

router.use(authenticateToken);

router.get("/", async (req, res) => {
  try {
    const { cliente } = req.query;
    const scope = scopedClientWhere(req.user);
    const conditions = [];
    const values = [...scope.values];

    if (scope.clause) {
      conditions.push(scope.clause);
    }

    if (cliente) {
      values.push(cliente);
      conditions.push(`cliente = $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const result = await db.query(
      `
      SELECT *
      FROM pedidos
      ${where}
      ORDER BY id DESC
      `,
      values
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
});

router.post("/", upload.single("ficheiro"), async (req, res) => {
  try {
    const {
      titulo,
      categoria,
      prioridade,
      estado,
      descricao,
      cliente,
      cliente_id,
      respostas,
      historico_respostas,
    } = req.body;

    const resolvedClientId = req.user.tipo === "Cliente" ? req.user.id : cliente_id;
    const client = await getClientById(db, resolvedClientId);
    const resolvedClientName = client?.empresa || cliente;

    const allowed = await canAccessClient(
      db,
      req.user,
      resolvedClientId,
      resolvedClientName
    );

    if (!allowed) {
      return res.status(403).json({ error: "Sem permissao para este cliente" });
    }

    const ficheiro = req.file ? req.file.filename : null;

    const result = await db.query(
      `
      INSERT INTO pedidos
      (
        titulo,
        categoria,
        prioridade,
        estado,
        descricao,
        cliente,
        cliente_id,
        respostas,
        historico_respostas,
        ficheiro
      )
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
      `,
      [
        titulo,
        categoria,
        prioridade,
        estado,
        descricao,
        resolvedClientName,
        resolvedClientId || null,
        respostas ?? 0,
        JSON.stringify(historico_respostas ?? []),
        ficheiro,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar pedido" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const currentResult = await db.query(
      "SELECT cliente_id, cliente FROM pedidos WHERE id = $1",
      [id]
    );

    if (currentResult.rowCount === 0) {
      return res.status(404).json({ error: "Pedido nao encontrado" });
    }

    const current = currentResult.rows[0];
    const allowedCurrent = await canAccessClient(
      db,
      req.user,
      current.cliente_id,
      current.cliente
    );

    if (!allowedCurrent) {
      return res.status(403).json({ error: "Sem permissao para este pedido" });
    }

    const {
      titulo,
      categoria,
      prioridade,
      estado,
      descricao,
      cliente,
      cliente_id,
      historico_respostas,
      respostasIncremento,
    } = req.body;

    const targetClientId = req.user.tipo === "Cliente" ? req.user.id : cliente_id || current.cliente_id;
    const targetClient = await getClientById(db, targetClientId);
    const targetClientName = targetClient?.empresa || cliente || current.cliente;
    const allowedTarget = await canAccessClient(
      db,
      req.user,
      targetClientId,
      targetClientName
    );

    if (!allowedTarget) {
      return res.status(403).json({ error: "Sem permissao para este cliente" });
    }

    const result = await db.query(
      `
      UPDATE pedidos
      SET
        titulo = $1,
        categoria = $2,
        prioridade = $3,
        estado = $4,
        descricao = $5,
        cliente = $6,
        cliente_id = $7,
        historico_respostas = COALESCE($9::jsonb, historico_respostas),
        respostas = GREATEST(respostas + COALESCE($10, 0), 0),
        data_atualizacao = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
      `,
      [
        titulo,
        categoria,
        prioridade,
        estado,
        descricao,
        targetClientName,
        targetClientId || null,
        id,
        historico_respostas ? JSON.stringify(historico_respostas) : null,
        respostasIncremento ?? 0,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao editar pedido" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const currentResult = await db.query(
      "SELECT cliente_id, cliente FROM pedidos WHERE id = $1",
      [id]
    );

    if (currentResult.rowCount === 0) {
      return res.status(404).json({ error: "Pedido nao encontrado" });
    }

    const allowed = await canAccessClient(
      db,
      req.user,
      currentResult.rows[0].cliente_id,
      currentResult.rows[0].cliente
    );

    if (!allowed) {
      return res.status(403).json({ error: "Sem permissao para este pedido" });
    }

    await db.query("DELETE FROM pedidos WHERE id = $1", [id]);
    res.json({ message: "Pedido apagado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao apagar pedido" });
  }
});

module.exports = router;
