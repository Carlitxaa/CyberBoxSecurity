const fs = require("fs");
const path = require("path");
const multer = require("multer");
const express = require("express");
const { authenticateToken } = require("../middleware/auth");

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

(async () => {
  try {
    await db.query("ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS ficheiro VARCHAR");
  } catch (error) {
    console.error("Erro ao garantir coluna ficheiro em pedidos:", error.message);
  }
})();

router.use(authenticateToken);

router.get("/", async (req, res) => {
  try {
    const { cliente } = req.query;
    let query = `SELECT * FROM pedidos`;
    const values = [];

    if (cliente) {
      query += ` WHERE cliente = $1`;
      values.push(cliente);
    }

    query += ` ORDER BY id DESC`;

    const result = await db.query(query, values);
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
        historico_respostas
        ,ficheiro
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
        cliente,
        cliente_id || null,
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
        cliente,
        cliente_id || null,
        id,
        historico_respostas ? JSON.stringify(historico_respostas) : null,
        respostasIncremento ?? 0,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao editar pedido" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `DELETE FROM pedidos WHERE id = $1`,
      [id]
    );

    res.json({ message: "Pedido apagado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao apagar pedido" });
  }
});

module.exports = router;
