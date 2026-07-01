const express = require("express");
const router = express.Router();
const db = require("../config/db");

const ensureNewsletterTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS newsletter (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      data_subscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ error: "Email inválido" });
    }

    await ensureNewsletterTable();

    const result = await db.query(
      `INSERT INTO newsletter (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING *`,
      [email.trim()]
    );

    if (result.rowCount === 0) {
      return res.status(409).json({ error: "Email já subscrito" });
    }

    res.status(201).json({ message: "Subscrição registada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao subscrever newsletter" });
  }
});

router.get("/", async (req, res) => {
  try {
    await ensureNewsletterTable();
    const result = await db.query(
      `SELECT id, email, data_subscricao FROM newsletter ORDER BY data_subscricao DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar subscrições" });
  }
});

module.exports = router;
