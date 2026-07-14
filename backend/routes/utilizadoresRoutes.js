const express = require("express");
const bcrypt = require("bcrypt");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

const db = require("../config/db");

router.use(authenticateToken);

router.get(
  "/",
  authorizeRoles("Administrador", "Gestor"),
  async (req, res) => {
    try {
      const result = await db.query(
        `SELECT id, nome, email, empresa, telefone, responsavel_seguranca, email_responsavel, contacto_permanente, email_contacto_permanente, tipo, estado, data_criacao FROM utilizadores ORDER BY id ASC`
      );

      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar utilizadores" });
    }
  }
);

router.post(
  "/",
  authorizeRoles("Administrador", "Gestor"),
  async (req, res) => {
    try {
      const {
        nome,
        email,
        password,
        empresa,
        telefone,
        responsavel_seguranca,
        email_responsavel,
        contacto_permanente,
        email_contacto_permanente,
        tipo,
        estado,
      } = req.body;

      if (!nome || !email || !password || !empresa || !tipo || !estado) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const result = await db.query(
        `
          INSERT INTO utilizadores
          (
            nome,
            email,
            password,
            empresa,
            telefone,
            responsavel_seguranca,
            email_responsavel,
            contacto_permanente,
            email_contacto_permanente,
            tipo,
            estado
          )
          VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING id, nome, email, empresa, telefone, responsavel_seguranca, email_responsavel, contacto_permanente, email_contacto_permanente, tipo, estado, data_criacao
          `,
        [
          nome,
          email,
          passwordHash,
          empresa,
          telefone || null,
          responsavel_seguranca || null,
          email_responsavel || null,
          contacto_permanente || null,
          email_contacto_permanente || null,
          tipo,
          estado,
        ]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar utilizador" });
    }
  }
);

router.delete(
  "/:id",
  authorizeRoles("Administrador", "Gestor"),
  async (req, res) => {
    try {
      const { id } = req.params;

      await db.query(
        `DELETE FROM utilizadores WHERE id = $1`,
        [id]
      );

      res.json({ message: "Utilizador apagado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao apagar utilizador" });
    }
  }
);

router.put(
  "/:id",
  authorizeRoles("Administrador", "Gestor"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        nome,
        email,
        empresa,
        telefone,
        responsavel_seguranca,
        email_responsavel,
        contacto_permanente,
        email_contacto_permanente,
        tipo,
        estado,
      } = req.body;

      const result = await db.query(
        `
          UPDATE utilizadores
          SET
            nome = $1,
            email = $2,
            empresa = $3,
            telefone = $4,
            responsavel_seguranca = $5,
            email_responsavel = $6,
            contacto_permanente = $7,
            email_contacto_permanente = $8,
            tipo = $9,
            estado = $10
          WHERE id = $11
          RETURNING id, nome, email, empresa, telefone, responsavel_seguranca, email_responsavel, contacto_permanente, email_contacto_permanente, tipo, estado, data_criacao
          `,
        [
          nome,
          email,
          empresa,
          telefone || null,
          responsavel_seguranca || null,
          email_responsavel || null,
          contacto_permanente || null,
          email_contacto_permanente || null,
          tipo,
          estado,
          id,
        ]
      );

      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao editar utilizador" });
    }
  }
);

module.exports =
  router;
