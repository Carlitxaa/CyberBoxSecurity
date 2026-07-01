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

const app =
  express();

app.use(cors());

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

app.listen(
  5000,
  () => {
    console.log(
      "Servidor a correr na porta 5000"
    );
  }
);

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);