const express = require("express");
const bcrypt = require("bcrypt");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const { isAdmin } = require("../utils/accessControl");

const router = express.Router();
const db = require("../config/db");
const USER_TYPES = ["Administrador", "Gestor", "Cliente"];

router.use(authenticateToken);

function normalizeCompany(tipo, empresa) {
  return tipo === "Cliente" ? empresa : empresa || "CyberBoxSecurity";
}

function normalizeManager(tipo, gestorId) {
  return tipo === "Cliente" ? gestorId || null : null;
}

router.get(
  "/",
  authorizeRoles("Administrador", "Gestor"),
  async (req, res) => {
    try {
      const selectSql = `
        SELECT
          u.id,
          u.nome,
          u.email,
          u.empresa,
          u.gestor_id,
          g.nome AS gestor_nome,
          u.telefone,
          u.responsavel_seguranca,
          u.email_responsavel,
          u.contacto_permanente,
          u.email_contacto_permanente,
          u.tipo,
          u.estado,
          u.data_criacao
        FROM utilizadores u
        LEFT JOIN utilizadores g ON g.id = u.gestor_id
      `;

      const result = isAdmin(req.user)
        ? await db.query(`${selectSql} ORDER BY u.id ASC`)
        : await db.query(
            `
            ${selectSql}
            WHERE u.tipo = 'Cliente' AND u.gestor_id = $1
            ORDER BY u.id ASC
            `,
            [req.user.id]
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
  authorizeRoles("Administrador"),
  async (req, res) => {
    try {
      const {
        nome,
        email,
        password,
        empresa,
        gestor_id,
        telefone,
        responsavel_seguranca,
        email_responsavel,
        contacto_permanente,
        email_contacto_permanente,
        tipo,
        estado,
      } = req.body;

      if (!USER_TYPES.includes(tipo)) {
        return res.status(400).json({ error: "Tipo de utilizador invalido" });
      }

      if (!nome || !email || !password || !tipo || !estado) {
        return res.status(400).json({ error: "Todos os campos obrigatorios devem ser preenchidos" });
      }

      if (tipo === "Cliente" && !empresa) {
        return res.status(400).json({ error: "A empresa e obrigatoria para clientes" });
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
          gestor_id,
          telefone,
          responsavel_seguranca,
          email_responsavel,
          contacto_permanente,
          email_contacto_permanente,
          tipo,
          estado
        )
        VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id, nome, email, empresa, gestor_id, telefone, responsavel_seguranca, email_responsavel, contacto_permanente, email_contacto_permanente, tipo, estado, data_criacao
        `,
        [
          nome,
          email,
          passwordHash,
          normalizeCompany(tipo, empresa),
          normalizeManager(tipo, gestor_id),
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
  authorizeRoles("Administrador"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const userResult = await db.query(
        "SELECT tipo FROM utilizadores WHERE id = $1",
        [id]
      );

      if (userResult.rowCount === 0) {
        return res.status(404).json({ error: "Utilizador nao encontrado" });
      }

      if (userResult.rows[0].tipo !== "Cliente") {
        return res.status(403).json({ error: "Apenas clientes podem ser eliminados" });
      }

      await db.query("DELETE FROM utilizadores WHERE id = $1", [id]);
      res.json({ message: "Cliente apagado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao apagar utilizador" });
    }
  }
);

router.put(
  "/:id",
  authorizeRoles("Administrador"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        nome,
        email,
        empresa,
        gestor_id,
        telefone,
        responsavel_seguranca,
        email_responsavel,
        contacto_permanente,
        email_contacto_permanente,
        tipo,
        estado,
      } = req.body;

      if (!USER_TYPES.includes(tipo)) {
        return res.status(400).json({ error: "Tipo de utilizador invalido" });
      }

      if (!nome || !email || !tipo || !estado) {
        return res.status(400).json({ error: "Todos os campos obrigatorios devem ser preenchidos" });
      }

      if (tipo === "Cliente" && !empresa) {
        return res.status(400).json({ error: "A empresa e obrigatoria para clientes" });
      }

      const result = await db.query(
        `
        UPDATE utilizadores
        SET
          nome = $1,
          email = $2,
          empresa = $3,
          gestor_id = $4,
          telefone = $5,
          responsavel_seguranca = $6,
          email_responsavel = $7,
          contacto_permanente = $8,
          email_contacto_permanente = $9,
          tipo = $10,
          estado = $11
        WHERE id = $12
        RETURNING id, nome, email, empresa, gestor_id, telefone, responsavel_seguranca, email_responsavel, contacto_permanente, email_contacto_permanente, tipo, estado, data_criacao
        `,
        [
          nome,
          email,
          normalizeCompany(tipo, empresa),
          normalizeManager(tipo, gestor_id),
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

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Utilizador nao encontrado" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao editar utilizador" });
    }
  }
);

module.exports = router;
