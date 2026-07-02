const bcrypt = require("bcrypt");
const db = require("./db");

async function ensureAdminUser() {
  const adminEmail =
    process.env.ADMIN_EMAIL || "admin@cyberbox.pt";
  const adminPassword =
    process.env.ADMIN_PASSWORD || "Admin123!";
  const adminName =
    process.env.ADMIN_NAME || "Administrador";
  const adminCompany =
    process.env.ADMIN_COMPANY || "CyberBoxSecurity";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await db.query(
    "SELECT id FROM utilizadores WHERE email = $1 LIMIT 1",
    [adminEmail]
  );

  if (existingAdmin.rowCount === 0) {
    await db.query(
      `
      INSERT INTO utilizadores
      (
        nome,
        email,
        password,
        empresa,
        tipo,
        estado
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        'Administrador',
        'Ativo'
      )
      `,
      [
        adminName,
        adminEmail,
        passwordHash,
        adminCompany,
      ]
    );

    return;
  }

  await db.query(
    `
    UPDATE utilizadores
    SET
      tipo = 'Administrador',
      estado = 'Ativo'
    WHERE email = $1
    `,
    [adminEmail]
  );
}

async function initializeDatabase() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS utilizadores (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      empresa VARCHAR(255) NOT NULL,
      tipo VARCHAR(50) NOT NULL,
      estado VARCHAR(50) NOT NULL DEFAULT 'Ativo',
      data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS artigos (
      id SERIAL PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      categoria VARCHAR(120),
      autor VARCHAR(255),
      conteudo TEXT,
      estado VARCHAR(50) NOT NULL DEFAULT 'Rascunho',
      imagem VARCHAR(500),
      data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS documentos (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      titulo VARCHAR(255),
      categoria VARCHAR(120) NOT NULL,
      cliente VARCHAR(255) NOT NULL,
      enviado_por VARCHAR(255) NOT NULL,
      ficheiro VARCHAR(500) NOT NULL,
      downloads INTEGER NOT NULL DEFAULT 0,
      data_upload TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id SERIAL PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      categoria VARCHAR(120),
      prioridade VARCHAR(50),
      estado VARCHAR(50) NOT NULL DEFAULT 'Pendente',
      descricao TEXT,
      cliente VARCHAR(255),
      respostas INTEGER NOT NULL DEFAULT 0,
      historico_respostas JSONB NOT NULL DEFAULT '[]'::jsonb,
      ficheiro VARCHAR(500),
      data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS newsletter (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      data_subscricao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query("ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS nome VARCHAR(255)");
  await db.query("ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS email VARCHAR(255)");
  await db.query("ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS password VARCHAR(255)");
  await db.query("ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS empresa VARCHAR(255)");
  await db.query("ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS tipo VARCHAR(50)");
  await db.query("ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS estado VARCHAR(50) DEFAULT 'Ativo'");
  await db.query("ALTER TABLE utilizadores ADD COLUMN IF NOT EXISTS data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP");

  await db.query("ALTER TABLE artigos ADD COLUMN IF NOT EXISTS titulo VARCHAR(255)");
  await db.query("ALTER TABLE artigos ADD COLUMN IF NOT EXISTS categoria VARCHAR(120)");
  await db.query("ALTER TABLE artigos ADD COLUMN IF NOT EXISTS autor VARCHAR(255)");
  await db.query("ALTER TABLE artigos ADD COLUMN IF NOT EXISTS conteudo TEXT");
  await db.query("ALTER TABLE artigos ADD COLUMN IF NOT EXISTS estado VARCHAR(50) DEFAULT 'Rascunho'");
  await db.query("ALTER TABLE artigos ADD COLUMN IF NOT EXISTS imagem VARCHAR(500)");
  await db.query("ALTER TABLE artigos ADD COLUMN IF NOT EXISTS data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP");

  await db.query("ALTER TABLE documentos ADD COLUMN IF NOT EXISTS nome VARCHAR(255)");
  await db.query("ALTER TABLE documentos ADD COLUMN IF NOT EXISTS titulo VARCHAR(255)");
  await db.query("ALTER TABLE documentos ADD COLUMN IF NOT EXISTS categoria VARCHAR(120)");
  await db.query("ALTER TABLE documentos ADD COLUMN IF NOT EXISTS cliente VARCHAR(255)");
  await db.query("ALTER TABLE documentos ADD COLUMN IF NOT EXISTS enviado_por VARCHAR(255)");
  await db.query("ALTER TABLE documentos ADD COLUMN IF NOT EXISTS ficheiro VARCHAR(500)");
  await db.query("ALTER TABLE documentos ADD COLUMN IF NOT EXISTS downloads INTEGER NOT NULL DEFAULT 0");
  await db.query("ALTER TABLE documentos ADD COLUMN IF NOT EXISTS data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP");

  await db.query("ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS titulo VARCHAR(255)");
  await db.query("ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS categoria VARCHAR(120)");
  await db.query("ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS prioridade VARCHAR(50)");
  await db.query("ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS estado VARCHAR(50) DEFAULT 'Pendente'");
  await db.query("ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS descricao TEXT");
  await db.query("ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS cliente VARCHAR(255)");
  await db.query("ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS respostas INTEGER NOT NULL DEFAULT 0");
  await db.query("ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS historico_respostas JSONB NOT NULL DEFAULT '[]'::jsonb");
  await db.query("ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS ficheiro VARCHAR(500)");
  await db.query("ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP");
  await db.query("ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP");

  await db.query("ALTER TABLE newsletter ADD COLUMN IF NOT EXISTS email VARCHAR(255)");
  await db.query("ALTER TABLE newsletter ADD COLUMN IF NOT EXISTS data_subscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP");

  await ensureAdminUser();
}

module.exports = initializeDatabase;
