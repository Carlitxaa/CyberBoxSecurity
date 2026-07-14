const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
const db = require("../config/db");

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const name = file.originalname.replace(/\s+/g, "-").toLowerCase();
    cb(null, `${timestamp}-${name}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];
    cb(null, allowed.includes(file.mimetype));
  },
});

/* BUSCAR ARTIGOS */
router.get(
  "/",
  async (req, res) => {
    try {
      const result =
        await db.query(
          `
          SELECT *
          FROM artigos
          ORDER BY id DESC
          `
        );

      res.json(
        result.rows
      );
    } catch (error) {
      console.error(
        error
      );

      res
        .status(500)
        .json({
          error:
            "Erro ao buscar artigos",
        });
    }
  }
);

/* CRIAR ARTIGO */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Administrador", "Gestor"),
  (req, res, next) => {
    const debugPath = path.join(__dirname, "../artigos-debug.log");
    fs.appendFileSync(
      debugPath,
      `[POST /artigos] entered route before multer\n`
    );
    next();
  },
  upload.single("imagem"),
  async (req, res) => {
    try {
      const debugPath = path.join(__dirname, "../artigos-debug.log");
      fs.appendFileSync(
        debugPath,
        `\n[POST /artigos] body=${JSON.stringify(req.body)} file=${JSON.stringify(req.file)}\n`
      );

      const {
        titulo,
        categoria,
        autor,
        conteudo,
        estado,
        imagem_url,
        metadados,
      } = req.body;

      const imagem = req.file
        ? `/uploads/${req.file.filename}`
        : imagem_url || null;

      const result =
        await db.query(
          `
          INSERT INTO artigos
          (
            titulo,
            categoria,
            autor,
            conteudo,
            estado,
            imagem,
            metadados
          )
          VALUES
          (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7::jsonb
          )
          RETURNING *
          `,
          [
            titulo,
            categoria,
            autor,
            conteudo,
            estado,
            imagem,
            metadados || "{}",
          ]
        );

      res.json(
        result.rows[0]
      );
    } catch (error) {
      console.error("Erro ao criar artigo:", error);
      console.error(error.stack);

      res
        .status(500)
        .json({
          error:
            "Erro ao criar artigo",
        });
    }
  }
);

/* APAGAR ARTIGO */
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Administrador", "Gestor"),
  async (req, res) => {
    try {
      const { id } =
        req.params;

      await db.query(
        `
        DELETE
        FROM artigos
        WHERE id = $1
        `,
        [id]
      );

      res.json({
        message:
          "Artigo apagado",
      });
    } catch (error) {
      console.error(
        error
      );

      res
        .status(500)
        .json({
          error:
            "Erro ao apagar artigo",
        });
    }
  }
);

/* BUSCAR ARTIGO POR ID (APENAS PUBLICADO PARA A PÚBLICO) */
router.get(
  "/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await db.query(
        `
        SELECT *
        FROM artigos
        WHERE id = $1
        `,
        [id]
      );

      if (!result.rows.length) {
        return res.status(404).json({ error: "Artigo não encontrado" });
      }

      const artigo = result.rows[0];

      // Apenas permitir acesso público a artigos publicados
      if (artigo.estado !== "Publicado") {
        return res.status(404).json({ error: "Artigo não encontrado" });
      }

      res.json(artigo);
    } catch (error) {
      console.error("Erro ao buscar artigo por id:", error);
      res.status(500).json({ error: "Erro ao buscar artigo" });
    }
  }
);

/* EDITAR ARTIGO */
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Administrador", "Gestor"),
  upload.single("imagem"),
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const {
        titulo,
        categoria,
        autor,
        conteudo,
        estado,
        imagem_url,
        metadados,
      } = req.body;

      const novaImagem = req.file
        ? `/uploads/${req.file.filename}`
        : imagem_url || null;

      const result =
        await db.query(
          `
          UPDATE artigos
          SET
            titulo = $1,
            categoria = $2,
            autor = $3,
            conteudo = $4,
            estado = $5,
            imagem = COALESCE(NULLIF($6, ''), imagem),
            metadados = $7::jsonb
          WHERE id = $8
          RETURNING *
          `,
          [
            titulo,
            categoria,
            autor,
            conteudo,
            estado,
            novaImagem,
            metadados || "{}",
            id,
          ]
        );

      res.json(
        result.rows[0]
      );
    } catch (error) {
      console.error("Erro ao editar artigo:", error);
      console.error(error.stack);

      res
        .status(500)
        .json({
          error:
            "Erro ao editar artigo",
        });
    }
  }
);

module.exports =
  router;
