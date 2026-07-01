const fs =
    require("fs");

const multer =
    require("multer");

const path =
    require("path");

const express =
    require("express");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router =
    express.Router();

const pool =
    require("../config/db");

router.use(authenticateToken);

const uploadsPath =
    path.join(__dirname, "..", "uploads");

fs.mkdirSync(uploadsPath, {
    recursive: true,
});

const storage =
    multer.diskStorage({
        destination:
            uploadsPath,
        filename:
            (
                req,
                file,
                cb
            ) => {
                cb(
                    null,
                    Date.now() +
                    path.extname(
                        file.originalname
                    )
                );
            },
    });

const upload =
    multer({
        storage,
    });

router.get(
    "/",
    async (req, res) => {
        try {
            const { cliente } = req.query;
            let query = `SELECT * FROM documentos`;
            const values = [];

            if (cliente) {
                query += ` WHERE cliente = $1`;
                values.push(cliente);
            }

            query += ` ORDER BY id DESC`;

            const result =
                await pool.query(query, values);

            res.json(
                result.rows
            );
        } catch (error) {
            console.error(
                error.message
            );
            res.status(500).json({ error: "Erro ao buscar documentos" });
        }
    }
);

router.post(
    "/",
    authorizeRoles("Administrador", "Gestor"),
    upload.single(
        "ficheiro"
    ),
    async (
        req,
        res
    ) => {
        try {
            const {
                nome,
                categoria,
                cliente,
                enviado_por,
            } = req.body;

            if (!nome || !categoria || !cliente || !enviado_por || !req.file) {
                return res.status(400).json({
                    error:
                        "Todos os campos são obrigatórios",
                });
            }

            const ficheiro =
                req.file.filename;

            const result =
                await pool.query(
                    `
INSERT INTO documentos
(
  nome,
  categoria,
  cliente,
  enviado_por,
  ficheiro
)
VALUES
(
  $1,
  $2,
  $3,
  $4,
  $5
)
RETURNING *
`,
                    [
                        nome,
                        categoria,
                        cliente,
                        enviado_por,
                        ficheiro,
                    ]
                );

            res.status(201).json(
                result.rows[0]
            );
        } catch (error) {
            console.error(
                error.message
            );
            res.status(500).json({
                error:
                    "Erro ao criar documento",
            });
        }
    }
);

router.get(
    "/:id/download",
    async (req, res) => {
        try {
            const result =
                await pool.query(
                    `
SELECT *
FROM documentos
WHERE id = $1
`,
                    [req.params.id]
                );

            if (
                result.rowCount ===
                0
            ) {
                return res
                    .status(404)
                    .json({
                        error:
                            "Documento não encontrado",
                    });
            }

            const doc =
                result.rows[0];
            const filePath =
                path.join(
                    uploadsPath,
                    doc.ficheiro
                );

            if (
                !fs.existsSync(
                    filePath
                )
            ) {
                return res
                    .status(404)
                    .json({
                        error:
                            "Ficheiro do documento não encontrado",
                    });
            }

            const downloadName =
                doc.nome
                    ? `${doc.nome}${path.extname(doc.ficheiro)}`
                    : doc.ficheiro;

            res.download(
                filePath,
                downloadName
            );
        } catch (error) {
            console.error(
                error.message
            );
            res.status(500).json({
                error:
                    "Erro ao processar download",
            });
        }
    }
);

router.put(
    "/:id/download",
    async (
        req,
        res
    ) => {
        try {
            const { id } =
                req.params;

            await pool.query(
                `
UPDATE documentos
SET downloads =
COALESCE(downloads, 0) + 1
WHERE id = $1
`,
                [id]
            );

            res.json({
                message:
                    "Download atualizado",
            });
        } catch (error) {
            console.error(
                error.message
            );

            res
                .status(500)
                .json({
                    error:
                        "Erro ao atualizar download",
                });
        }
    }
);

router.delete(
    "/:id",
    authorizeRoles("Administrador", "Gestor"),
    async (req, res) => {
        try {
            const result = await pool.query(
                `
DELETE FROM documentos
WHERE id = $1
`,
                [req.params.id]
            );

            if (result.rowCount === 0) {
                return res.status(404).json({ error: "Documento não encontrado" });
            }

            res.json({
                message:
                    "apagado",
            });
        } catch (error) {
            console.error(
                error
            );
            res.status(500).json({ error: "Erro ao apagar documento" });
        }
    }
);

module.exports =
    router;
