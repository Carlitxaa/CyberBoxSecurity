const fs = require("fs");
const multer = require("multer");
const path = require("path");
const express = require("express");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const {
  canAccessClient,
  getClientById,
  scopedClientWhere,
} = require("../utils/accessControl");

const router = express.Router();
const pool = require("../config/db");

router.use(authenticateToken);

const uploadsPath = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadsPath, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsPath,
  filename: (req, file, cb) => {
    const safeName = path
      .basename(file.originalname, path.extname(file.originalname))
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();
    cb(null, `${Date.now()}-${safeName || "ficheiro"}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

function resolveUploadPath(fileName) {
  const storedName = path.basename(String(fileName || ""));
  return path.join(uploadsPath, storedName);
}

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
    const result = await pool.query(
      `
      SELECT *
      FROM documentos
      ${where}
      ORDER BY id DESC
      `,
      values
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Erro ao buscar documentos" });
  }
});

router.post(
  "/",
  authorizeRoles("Administrador", "Gestor", "Cliente"),
  upload.single("ficheiro"),
  async (req, res) => {
    try {
      const {
        nome,
        categoria,
        cliente,
        cliente_id,
        enviado_por,
        metadados,
      } = req.body;

      if (!nome || !categoria || !enviado_por || !req.file) {
        return res.status(400).json({ error: "Todos os campos obrigatorios devem ser preenchidos" });
      }

      const resolvedClientId = req.user.tipo === "Cliente" ? req.user.id : cliente_id;
      const client = await getClientById(pool, resolvedClientId);
      const resolvedClientName = client?.empresa || cliente;

      if (!resolvedClientName) {
        return res.status(400).json({ error: "Cliente invalido" });
      }

      const allowed = await canAccessClient(
        pool,
        req.user,
        resolvedClientId,
        resolvedClientName
      );

      if (!allowed) {
        return res.status(403).json({ error: "Sem permissao para este cliente" });
      }

      const ficheiro = req.file.filename;

      const result = await pool.query(
        `
        INSERT INTO documentos
        (
          nome,
          categoria,
          cliente,
          cliente_id,
          enviado_por,
          ficheiro,
          metadados
        )
        VALUES
        ($1, $2, $3, $4, $5, $6, $7::jsonb)
        RETURNING *
        `,
        [
          nome,
          categoria,
          resolvedClientName,
          resolvedClientId || null,
          enviado_por,
          ficheiro,
          metadados || "{}",
        ]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Erro ao criar documento" });
    }
  }
);

router.get("/:id/download", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM documentos
      WHERE id = $1
      `,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Documento nao encontrado" });
    }

    const doc = result.rows[0];
    const allowed = await canAccessClient(pool, req.user, doc.cliente_id, doc.cliente);
    if (!allowed) {
      return res.status(403).json({ error: "Sem permissao para este documento" });
    }

    const filePath = resolveUploadPath(doc.ficheiro);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Ficheiro do documento nao encontrado" });
    }

    const downloadName = doc.nome
      ? `${doc.nome}${path.extname(doc.ficheiro)}`
      : path.basename(doc.ficheiro);

    await pool.query(
      "UPDATE documentos SET downloads = COALESCE(downloads, 0) + 1 WHERE id = $1",
      [req.params.id]
    );

    res.download(filePath, downloadName);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Erro ao processar download" });
  }
});

router.put("/:id/download", async (req, res) => {
  try {
    const { id } = req.params;
    const docResult = await pool.query(
      "SELECT cliente_id, cliente FROM documentos WHERE id = $1",
      [id]
    );

    if (docResult.rowCount === 0) {
      return res.status(404).json({ error: "Documento nao encontrado" });
    }

    const allowed = await canAccessClient(
      pool,
      req.user,
      docResult.rows[0].cliente_id,
      docResult.rows[0].cliente
    );

    if (!allowed) {
      return res.status(403).json({ error: "Sem permissao para este documento" });
    }

    await pool.query(
      `
      UPDATE documentos
      SET downloads = COALESCE(downloads, 0) + 1
      WHERE id = $1
      `,
      [id]
    );

    res.json({ message: "Download atualizado" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Erro ao atualizar download" });
  }
});

router.delete(
  "/:id",
  authorizeRoles("Administrador", "Gestor"),
  async (req, res) => {
    try {
      const docResult = await pool.query(
        "SELECT cliente_id, cliente FROM documentos WHERE id = $1",
        [req.params.id]
      );

      if (docResult.rowCount === 0) {
        return res.status(404).json({ error: "Documento nao encontrado" });
      }

      const allowed = await canAccessClient(
        pool,
        req.user,
        docResult.rows[0].cliente_id,
        docResult.rows[0].cliente
      );

      if (!allowed) {
        return res.status(403).json({ error: "Sem permissao para este documento" });
      }

      await pool.query("DELETE FROM documentos WHERE id = $1", [req.params.id]);
      res.json({ message: "apagado" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao apagar documento" });
    }
  }
);

module.exports = router;
