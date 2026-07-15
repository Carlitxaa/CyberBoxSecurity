function isAdmin(user) {
  return user?.tipo === "Administrador";
}

function isManager(user) {
  return user?.tipo === "Gestor";
}

function isClient(user) {
  return user?.tipo === "Cliente";
}

async function getClientById(db, id) {
  if (!id) {
    return null;
  }

  const result = await db.query(
    `
    SELECT id, nome, email, empresa, gestor_id, tipo, estado
    FROM utilizadores
    WHERE id = $1 AND tipo = 'Cliente'
    `,
    [id]
  );

  return result.rows[0] || null;
}

async function canAccessClient(db, user, clientId, clientName) {
  if (isAdmin(user)) {
    return true;
  }

  if (isManager(user)) {
    const result = await db.query(
      `
      SELECT id
      FROM utilizadores
      WHERE tipo = 'Cliente'
        AND gestor_id = $1
        AND (
          id = $2
          OR empresa = $3
        )
      LIMIT 1
      `,
      [user.id, clientId || null, clientName || null]
    );

    return result.rowCount > 0;
  }

  if (isClient(user)) {
    return String(clientId || "") === String(user.id) || clientName === user.empresa;
  }

  return false;
}

function scopedClientWhere(user, tableAlias = "") {
  const prefix = tableAlias ? `${tableAlias}.` : "";

  if (isAdmin(user)) {
    return {
      clause: "",
      values: [],
    };
  }

  if (isManager(user)) {
    return {
      clause: `${prefix}cliente_id IN (SELECT id FROM utilizadores WHERE tipo = 'Cliente' AND gestor_id = $1)`,
      values: [user.id],
    };
  }

  if (isClient(user)) {
    return {
      clause: `(${prefix}cliente_id = $1 OR ${prefix}cliente = $2)`,
      values: [user.id, user.empresa],
    };
  }

  return {
    clause: "1 = 0",
    values: [],
  };
}

module.exports = {
  canAccessClient,
  getClientById,
  isAdmin,
  isClient,
  isManager,
  scopedClientWhere,
};
