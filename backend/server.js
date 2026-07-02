const path =
  require("path");

const express =
  require("express");

const cors =
  require("cors");

const utilizadoresRoutes =
  require(
    "./routes/utilizadoresRoutes"
  );

  const loginRoutes =
  require(
    "./routes/loginRoutes"
  );

  const artigosRoutes =
  require(
    "./routes/artigosRoutes"
  );

const documentosRoutes =
  require(
    "./routes/documentosRoutes"
  );

const pedidosRoutes =
  require(
    "./routes/pedidosRoutes"
  );

const newsletterRoutes =
  require(
    "./routes/newsletterRoutes"
  );

const dashboardRoutes =
  require(
    "./routes/dashboardRoutes"
  );

const initializeDatabase =
  require(
    "./config/initDb"
  );

const app =
  express();



const allowedOrigins =
  (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
        return;
      }

      callback(new Error("Origem bloqueada pelo CORS"));
    },
  })
);

app.use(
  express.json()
);

app.use(
  express.urlencoded({ extended: true })
);

app.use((req, res, next) => {
  console.log(`REQ ${req.method} ${req.url} content-type=${req.headers['content-type']}`);
  next();
});

app.use(
  "/utilizadores",
  utilizadoresRoutes
);

app.use(
  "/login",
  loginRoutes
);

app.use(
  "/artigos",
  artigosRoutes
);

app.use(
  "/documentos",
  documentosRoutes
);

app.use(
  "/pedidos",
  pedidosRoutes
);

app.use(
  "/newsletter",
  newsletterRoutes
);

app.use(
  "/dashboard",
  dashboardRoutes
);

app.get(
  "/",
  (req, res) => {
    res.send(
      "API a funcionar 😭"
    );
  }
);

app.get(
  "/health",
  (req, res) => {
    res.status(200).json({
      status: "ok",
    });
  }
);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initializeDatabase();
    console.log("Base de dados inicializada");

    app.listen(PORT, () => {
      console.log(`Servidor a correr na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao inicializar a base de dados:", error);
    process.exit(1);
  }
}

startServer();

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);
