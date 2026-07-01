const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

const db = require("../config/db");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e password são obrigatórios" });
    }

    const result = await db.query(
      `
      SELECT id, nome, email, empresa, tipo, estado, password
      FROM utilizadores
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const user = result.rows[0];
    const passwordHash = user.password;
    let passwordMatch = false;

    if (passwordHash) {
      try {
        passwordMatch = await bcrypt.compare(password, passwordHash);
      } catch (err) {
        passwordMatch = false;
      }
    }

    if (!passwordMatch) {
      if (passwordHash === password) {
        const newHash = await bcrypt.hash(password, 10);
        await db.query(`UPDATE utilizadores SET password = $1 WHERE id = $2`, [newHash, user.id]);
      } else {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }
    }

    if (user.estado !== "Ativo") {
      return res.status(403).json({ error: "Conta inativa. Contacte o administrador." });
    }

    const token = jwt.sign(
      {
        id: user.id,
        tipo: user.tipo,
        email: user.email,
        empresa: user.empresa,
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        empresa: user.empresa,
        tipo: user.tipo,
        estado: user.estado,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro no login" });
  }
});

module.exports = router;