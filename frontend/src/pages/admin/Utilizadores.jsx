import {
  useState,
  useEffect,
} from "react";

import {
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaUserCircle,
  FaTimes,
} from "react-icons/fa";

import axios from "axios";
import { API_URL } from "../../config/api";

export default function Utilizadores() {
  const [
    mostrarFormulario,
    setMostrarFormulario,
  ] = useState(false);

  const [
    mostrarVer,
    setMostrarVer,
  ] = useState(false);

  const [
    mostrarEditar,
    setMostrarEditar,
  ] = useState(false);

  const [
    utilizadorVer,
    setUtilizadorVer,
  ] = useState(null);

  const [
    mostrarApagar,
    setMostrarApagar,
  ] = useState(false);

  const [
    utilizadorSelecionado,
    setUtilizadorSelecionado,
  ] = useState(null);

  const [
    utilizadorEditar,
    setUtilizadorEditar,
  ] = useState({
    nome: "",
    email: "",
    empresa: "",
    tipo: "",
    estado: "",
  });

  const [
    utilizadores,
    setUtilizadores,
  ] = useState([]);

  const [
    pesquisa,
    setPesquisa,
  ] = useState("");

  const [
    filtroTipo,
    setFiltroTipo,
  ] = useState(
    "Todos os Tipos"
  );

  const [
    filtroEstado,
    setFiltroEstado,
  ] = useState(
    "Todos os Estados"
  );

  const [
    novoUtilizador,
    setNovoUtilizador,
  ] = useState({
    nome: "",
    email: "",
    password: "",
    empresa: "",
    tipo: "Cliente",
    estado: "Ativo",
  });

  async function buscarUtilizadores() {
    try {
      const response = await axios.get(
        `${API_URL}/utilizadores`
      );

      setUtilizadores(response.data);
    } catch (error) {
      console.error("Erro ao buscar utilizadores:", error);
    }
  }

  useEffect(() => {
    async function carregarUtilizadores() {
      await buscarUtilizadores();
    }

    carregarUtilizadores();
  }, []);

  async function criarUtilizador(event) {
    if (event) {
      event.preventDefault();
    }

    try {
      await axios.post(
        `${API_URL}/utilizadores`,
        novoUtilizador
      );

      buscarUtilizadores();

      setNovoUtilizador({
        nome: "",
        email: "",
        password: "",
        empresa: "",
        tipo: "Cliente",
        estado: "Ativo",
      });

      setMostrarFormulario(
        false
      );
    } catch (error) {
      console.error(
        "Erro ao criar utilizador:",
        error
      );
    }
  }

  async function apagarUtilizador() {
    try {
      await axios.delete(
        `${API_URL}/utilizadores/${utilizadorSelecionado}`
      );

      buscarUtilizadores();

      setMostrarApagar(
        false
      );

      setUtilizadorSelecionado(
        null
      );
    } catch (error) {
      console.error(
        "Erro ao apagar utilizador:",
        error
      );
    }
  }

  async function editarUtilizador() {
    try {
      await axios.put(
        `${API_URL}/utilizadores/${utilizadorSelecionado}`,
        utilizadorEditar
      );

      buscarUtilizadores();

      setMostrarEditar(
        false
      );

      setUtilizadorSelecionado(
        null
      );
    } catch (error) {
      console.error(
        "Erro ao editar utilizador:",
        error
      );
    }
  }

  const utilizadoresFiltrados =
    utilizadores.filter(
      (user) => {
        const pesquisaMatch =
          user.nome
            .toLowerCase()
            .includes(
              pesquisa.toLowerCase()
            ) ||
          user.email
            .toLowerCase()
            .includes(
              pesquisa.toLowerCase()
            );

        const tipoMatch =
          filtroTipo ===
          "Todos os Tipos" ||
          user.tipo ===
          filtroTipo;

        const estadoMatch =
          filtroEstado ===
          "Todos os Estados" ||
          user.estado ===
          filtroEstado;

        return (
          pesquisaMatch &&
          tipoMatch &&
          estadoMatch
        );
      }
    );

  const getTipoColor = (
    tipo
  ) => {
    switch (tipo) {
      case "Administrador":
        return "#FCE7F3";

      case "Gestor":
        return "#E9D5FF";

      case "Cliente":
        return "#DBEAFE";

      default:
        return "#D1FAE5";
    }
  };

  return (
    <div
      style={{
        minHeight:
          "100vh",
        background:
          "#F5F3F4",
        borderRadius:
          "40px",
        padding:
          "35px",
      }}
    >
      {/* POPUP VER */}
      {mostrarVer && (
        <div
          style={{
            position:
              "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.35)",
            display:
              "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width:
                "700px",
              background:
                "white",
              borderRadius:
                "20px",
              overflow:
                "hidden",
            }}
          >
            <div
              className="d-flex justify-content-between align-items-center"
              style={{
                padding:
                  "25px",
                borderBottom:
                  "1px solid #ddd",
              }}
            >
              <h4>
                Detalhes do
                Utilizador
              </h4>

              <FaTimes
                style={{
                  cursor:
                    "pointer",
                }}
                onClick={() =>
                  setMostrarVer(
                    false
                  )
                }
              />
            </div>

            <div
              style={{
                padding:
                  "25px",
              }}
            >
              <div className="d-flex align-items-center gap-4 mb-4">
                <div
                  style={{
                    width:
                      "80px",
                    height:
                      "80px",
                    borderRadius:
                      "50%",
                    background:
                      "#12C4EB",
                    display:
                      "flex",
                    justifyContent:
                      "center",
                    alignItems:
                      "center",
                    color:
                      "white",
                    fontWeight:
                      "700",
                    fontSize:
                      "28px",
                  }}
                >
                  {
                    utilizadorVer?.nome
                      ?.split(" ")
                      .map(
                        (n) => n[0]
                      )
                      .join("")
                  }
                </div>

                <div>
                  <h3>
                    {
                      utilizadorVer?.nome
                    }
                  </h3>

                  <p
                    style={{
                      color:
                        "#777",
                    }}
                  >
                    {
                      utilizadorVer?.email
                    }
                  </p>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <small>
                    Empresa
                  </small>

                  <h6>
                    {
                      utilizadorVer?.empresa
                    }
                  </h6>
                </div>

                <div className="col-md-6 mb-3">
                  <small>
                    Tipo de
                    Utilizador
                  </small>

                  <div>
                    <span
                      style={{
                        background:
                          "#D1FAE5",
                        padding:
                          "6px 14px",
                        borderRadius:
                          "20px",
                      }}
                    >
                      {
                        utilizadorVer?.tipo
                      }
                    </span>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <small>
                    Estado
                  </small>

                  <div>
                    <span
                      style={{
                        background:
                          "#42E66E",
                        color:
                          "white",
                        padding:
                          "6px 14px",
                        borderRadius:
                          "20px",
                      }}
                    >
                      {
                        utilizadorVer?.estado === "ativo"
                          ? "Ativo"
                          : "Inativo"
                      }
                    </span>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <small>
                    Último
                    acesso
                  </small>

                  <h6>
                    {
                      utilizadorVer?.data_criacao
                        ? new Date(
                          utilizadorVer.data_criacao
                        ).toLocaleDateString(
                          "pt-PT"
                        )
                        : ""
                    }
                  </h6>
                </div>
              </div>

              <div className="d-flex gap-3">
                <button
                  className="btn flex-grow-1"
                  style={{
                    background:
                      "#4D7BFF",
                    color:
                      "white",
                    borderRadius:
                      "20px",
                  }}
                  onClick={() => {
                    setMostrarVer(
                      false
                    );
                    setMostrarEditar(
                      true
                    );
                  }}
                >
                  Editar
                  Utilizador
                </button>

                <button
                  className="btn btn-light"
                  onClick={() =>
                    setMostrarVer(
                      false
                    )
                  }
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP EDITAR */}
      {mostrarEditar && (
        <div
          style={{
            position:
              "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.35)",
            display:
              "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width:
                "700px",
              background:
                "white",
              borderRadius:
                "20px",
              overflow:
                "hidden",
            }}
          >
            <div
              className="d-flex justify-content-between align-items-center"
              style={{
                padding:
                  "25px",
                borderBottom:
                  "1px solid #ddd",
              }}
            >
              <h4>
                Editar
                Utilizador
              </h4>

              <FaTimes
                style={{
                  cursor:
                    "pointer",
                }}
                onClick={() =>
                  setMostrarEditar(
                    false
                  )
                }
              />
            </div>

            <div
              style={{
                padding:
                  "25px",
              }}
            >
              <div className="mb-3">
                <label>
                  Nome
                </label>

                <input
                  className="form-control"
                  value={
                    utilizadorEditar.nome
                  }
                  onChange={(e) =>
                    setUtilizadorEditar({
                      ...utilizadorEditar,
                      nome:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <label>
                  Email
                </label>

                <input
                  className="form-control"
                  value={
                    utilizadorEditar.email
                  }
                  onChange={(e) =>
                    setUtilizadorEditar({
                      ...utilizadorEditar,
                      email:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <label>
                  Empresa
                </label>
                <input
                  className="form-control"
                  value={
                    utilizadorEditar.empresa
                  }
                  onChange={(e) =>
                    setUtilizadorEditar({
                      ...utilizadorEditar,
                      empresa:
                        e.target.value,
                    })
                  }
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>
                    Tipo
                  </label>

                  <select
                    className="form-select"
                    value={
                      utilizadorEditar.tipo
                    }
                    onChange={(e) =>
                      setUtilizadorEditar({
                        ...utilizadorEditar,
                        tipo:
                          e.target.value,
                      })
                    }
                  >
                    <option>
                      Administrador
                    </option>
                    <option>
                      Gestor
                    </option>
                    <option>
                      Cliente
                    </option>
                    <option>
                      Colaborador
                    </option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label>
                    Estado
                  </label>

                  <select
                    className="form-select"
                    value={
                      utilizadorEditar.estado
                    }
                    onChange={(e) =>
                      setUtilizadorEditar({
                        ...utilizadorEditar,
                        estado:
                          e.target.value,
                      })
                    }
                  >
                    <option>
                      Ativo
                    </option>

                    <option>
                      Inativo
                    </option>
                  </select>
                </div>
              </div>

              <div className="d-flex gap-3 mt-4">
                <button
                  className="btn"
                  onClick={
                    editarUtilizador
                  }
                  style={{
                    background:
                      "#12C4EB",
                    color:
                      "white",
                    borderRadius:
                      "20px",
                    padding:
                      "10px 25px",
                  }}
                >
                  Guardar
                  Alterações
                </button>

                <button
                  className="btn btn-secondary"
                  style={{
                    borderRadius:
                      "20px",
                    padding:
                      "10px 25px",
                  }}
                  onClick={() =>
                    setMostrarEditar(
                      false
                    )
                  }
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP APAGAR */}
      {mostrarApagar && (
        <div
          style={{
            position:
              "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.35)",
            display:
              "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background:
                "white",
              borderRadius:
                "25px",
              padding:
                "30px",
              width:
                "420px",
              textAlign:
                "center",
            }}
          >
            <h4>
              Tem certeza?
            </h4>

            <p
              style={{
                color:
                  "#666",
                marginTop:
                  "10px",
              }}
            >
              Tem certeza que
              quer apagar este
              utilizador?
            </p>

            <div className="d-flex gap-3 mt-4">
              <button
                className="btn btn-secondary flex-grow-1"
                onClick={() =>
                  setMostrarApagar(
                    false
                  )
                }
              >
                Cancelar
              </button>

              <button
                className="btn btn-danger flex-grow-1"
                onClick={
                  apagarUtilizador
                }
              >
                Apagar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1
            style={{
              fontWeight:
                "700",
              fontSize:
                "42px",
              margin: 0,
            }}
          >
            Gestão de
            Utilizadores
          </h1>

          <p
            style={{
              color:
                "#8b8b8b",
              marginTop:
                "8px",
            }}
          >
            Gerir utilizadores
            da plataforma
          </p>
        </div>

        <button
          onClick={() =>
            setMostrarFormulario(
              !mostrarFormulario
            )
          }
          className="btn d-flex align-items-center gap-2"
          style={{
            background:
              "#BFEFFF",
            borderRadius:
              "30px",
            padding:
              "12px 25px",
            fontWeight:
              "600",
          }}
        >
          <FaPlus />
          Novo Utilizador
        </button>
      </div>

      {/* FORMULÁRIO */}
      {mostrarFormulario && (
        <form
          onSubmit={criarUtilizador}
          style={{
            background:
              "#DDF6FB",
            border:
              "2px solid #12C4EB",
            borderRadius:
              "35px",
            padding:
              "30px",
            marginBottom:
              "30px",
          }}
        >
          <h4
            style={{
              fontWeight:
                "700",
              marginBottom:
                "20px",
            }}
          >
            Criar Novo
            Utilizador
          </h4>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label>
                Nome
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Nome do utilizador"
                value={novoUtilizador.nome}
                onChange={(e) =>
                  setNovoUtilizador({
                    ...novoUtilizador,
                    nome: e.target.value,
                  })
                }
                style={{
                  border: "2px solid #12C4EB",
                  borderRadius: "30px",
                  padding: "16px 20px",
                  background: "white",
                }}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>
                Email
              </label>

              <input
                type="email"
                className="form-control"
                placeholder="Email do utilizador"
                value={novoUtilizador.email}
                onChange={(e) =>
                  setNovoUtilizador({
                    ...novoUtilizador,
                    email: e.target.value,
                  })
                }
                style={{
                  border: "2px solid #12C4EB",
                  borderRadius: "30px",
                  padding: "16px 20px",
                  background: "white",
                }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label>
                Password
              </label>

              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={novoUtilizador.password}
                onChange={(e) =>
                  setNovoUtilizador({
                    ...novoUtilizador,
                    password: e.target.value,
                  })
                }
                style={{
                  border: "2px solid #12C4EB",
                  borderRadius: "30px",
                  padding: "16px 20px",
                  background: "white",
                }}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>
                Empresa
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Empresa"
                value={novoUtilizador.empresa}
                onChange={(e) =>
                  setNovoUtilizador({
                    ...novoUtilizador,
                    empresa: e.target.value,
                  })
                }
                style={{
                  border: "2px solid #12C4EB",
                  borderRadius: "30px",
                  padding: "16px 20px",
                  background: "white",
                }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label>
                Tipo
              </label>

              <select
                className="form-select"
                value={novoUtilizador.tipo}
                onChange={(e) =>
                  setNovoUtilizador({
                    ...novoUtilizador,
                    tipo: e.target.value,
                  })
                }
                style={{
                  border: "2px solid #12C4EB",
                  borderRadius: "30px",
                  background: "white",
                  padding: "12px 20px",
                }}
              >
                <option>Cliente</option>
                <option>Gestor</option>
                <option>Colaborador</option>
                <option>Administrador</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label>
                Estado
              </label>

              <select
                className="form-select"
                value={novoUtilizador.estado}
                onChange={(e) =>
                  setNovoUtilizador({
                    ...novoUtilizador,
                    estado: e.target.value,
                  })
                }
                style={{
                  border: "2px solid #12C4EB",
                  borderRadius: "30px",
                  background: "white",
                  padding: "12px 20px",
                }}
              >
                <option>Ativo</option>
                <option>Inativo</option>
              </select>
            </div>
          </div>

          <div className="d-flex gap-3">
            <button
              type="submit"
              className="btn"
              style={{
                background: "#12C4EB",
                color: "white",
                borderRadius: "30px",
                padding: "12px 30px",
                fontWeight: "600",
              }}
            >
              Criar
              Utilizador
            </button>

            <button
              type="button"
              className="btn"
              style={{
                background: "#6B7280",
                color: "white",
                borderRadius: "30px",
                padding: "12px 30px",
                fontWeight: "600",
              }}
              onClick={() =>
                setMostrarFormulario(
                  false
                )
              }
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* CARDS */}
      <div className="row g-4 mb-4">
        {[
          {
            title:
              "Total Utilizadores",
            value:
              utilizadores.length,
          },
          {
            title:
              "Clientes",
            value:
              utilizadores.filter(
                (u) =>
                  u.tipo ===
                  "Cliente"
              ).length,
          },
          {
            title:
              "Colaboradores",
            value:
              utilizadores.filter(
                (u) =>
                  u.tipo ===
                  "Colaborador"
              ).length,
          },
          {
            title:
              "Administradores",
            value:
              utilizadores.filter(
                (u) =>
                  u.tipo ===
                  "Administrador"
              ).length,
          },
        ].map(
          (
            card,
            index
          ) => (
            <div
              className="col-lg-3"
              key={index}
            >
              <div
                style={{
                  background:
                    "#DDF6FB",
                  borderRadius:
                    "30px",
                  padding:
                    "28px",
                  border:
                    "2px solid #12C4EB",
                  textAlign:
                    "center",
                }}
              >
                <h2>
                  {
                    card.value
                  }
                </h2>

                <p>
                  {
                    card.title
                  }
                </p>
              </div>
            </div>
          )
        )}
      </div>
      {/* PESQUISA */}
      <div
        style={{
          background:
            "#10C4E8",
          borderRadius:
            "30px",
          padding:
            "20px",
          marginBottom:
            "25px",
        }}
      >
        <div className="row g-3">
          <div className="col-lg-7">
            <div
              style={{
                background:
                  "#BFEFFF",
                borderRadius:
                  "30px",
                padding:
                  "12px 20px",
              }}
              className="d-flex align-items-center"
            >
              <FaSearch color="#7f7f7f" />

              <input
                type="text"
                placeholder="Pesquisar utilizador..."
                value={pesquisa}
                onChange={(e) =>
                  setPesquisa(
                    e.target.value
                  )
                }
                style={{
                  border:
                    "none",
                  background:
                    "transparent",
                  outline:
                    "none",
                  width:
                    "100%",
                  marginLeft:
                    "10px",
                }}
              />
            </div>
          </div>

          <div className="col-lg-2">
            <select
              className="form-select"
              value={filtroTipo}
              onChange={(e) =>
                setFiltroTipo(
                  e.target.value
                )
              }
              style={{
                height:
                  "48px",
                borderRadius:
                  "30px",
                backgroundColor:
                  "#BFEFFF",
                border:
                  "none",
              }}
            >
              <option>
                Todos os Tipos
              </option>

              <option>
                Administrador
              </option>

              <option>
                Gestor
              </option>

              <option>
                Cliente
              </option>

              <option>
                Colaborador
              </option>
            </select>
          </div>

          <div className="col-lg-3">
            <select
              className="form-select"
              value={filtroEstado}
              onChange={(e) =>
                setFiltroEstado(
                  e.target.value
                )
              }
              style={{
                height:
                  "48px",
                borderRadius:
                  "30px",
                backgroundColor:
                  "#BFEFFF",
                border:
                  "none",
              }}
            >
              <option>
                Todos os Estados
              </option>

              <option>
                Ativo
              </option>

              <option>
                Inativo
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* TABELA */}
      <div
        style={{
          background:
            "#DDF6FB",
          borderRadius:
            "30px",
          overflow:
            "hidden",
        }}
      >
        <div
          className="row text-center align-items-center"
          style={{
            background:
              "#10C4E8",
            padding:
              "20px 30px",
            fontWeight:
              "600",
          }}
        >
          <div className="col-3 text-start">
            Utilizador
          </div>

          <div className="col">
            Empresa
          </div>

          <div className="col">
            Tipo
          </div>

          <div className="col">
            Estado
          </div>

          <div className="col">
            Último Acesso
          </div>

          <div className="col">
            Ações
          </div>
        </div>

        {utilizadoresFiltrados.map(
          (
            user,
            index
          ) => (
            <div
              key={index}
              className="row align-items-center text-center"
              style={{
                padding:
                  "22px 30px",
                borderBottom:
                  index !==
                    utilizadoresFiltrados.length -
                    1
                    ? "2px solid #12C4EB"
                    : "none",
              }}
            >
              <div className="col-3">
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width:
                        "50px",
                      height:
                        "50px",
                      borderRadius:
                        "50%",
                      background:
                        getTipoColor(
                          user.tipo
                        ),
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                    }}
                  >
                    <FaUserCircle
                      size={28}
                      color="#6B7280"
                    />
                  </div>

                  <div className="text-start">
                    <div
                      style={{
                        fontWeight:
                          "600",
                      }}
                    >
                      {
                        user.nome
                      }
                    </div>

                    <small
                      style={{
                        color:
                          "#8b8b8b",
                      }}
                    >
                      {
                        user.email
                      }
                    </small>
                  </div>
                </div>
              </div>

              <div className="col">
                {
                  user.empresa
                }
              </div>

              <div className="col">
                <span
                  style={{
                    background:
                      getTipoColor(
                        user.tipo
                      ),
                    padding:
                      "6px 14px",
                    borderRadius:
                      "20px",
                  }}
                >
                  {user.tipo}
                </span>
              </div>

              <div className="col">
                <span
                  style={{
                    background:
                      user.estado ===
                        "Ativo"
                        ? "#42E66E"
                        : "#F87171",
                    color:
                      "white",
                    padding:
                      "6px 14px",
                    borderRadius:
                      "20px",
                  }}
                >
                  {
                    user.estado
                  }
                </span>
              </div>

              <div className="col">
                {new Date(
                  user.data_criacao
                ).toLocaleDateString(
                  "pt-PT"
                )}
              </div>

              <div className="col">
                <div className="d-flex justify-content-center gap-3">
                  <FaEye
                    color="#4D7BFF"
                    style={{
                      cursor:
                        "pointer",
                    }}
                    onClick={() => {
                      setUtilizadorVer(
                        user
                      );

                      setMostrarVer(
                        true
                      );
                    }}
                  />
                  <FaEdit
                    color="#6A5CFF"
                    style={{
                      cursor:
                        "pointer",
                    }}
                    onClick={() => {
                      setUtilizadorSelecionado(
                        user.id
                      );

                      setUtilizadorEditar({
                        nome:
                          user.nome,
                        email:
                          user.email,
                        empresa:
                          user.empresa,
                        tipo:
                          user.tipo,
                        estado:
                          user.estado,
                      });

                      setMostrarEditar(
                        true
                      );
                    }}
                  />

                  <FaTrash
                    color="#FF4B4B"
                    style={{
                      cursor:
                        "pointer",
                    }}
                    onClick={() => {
                      setUtilizadorSelecionado(
                        user.id
                      );

                      setMostrarApagar(
                        true
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          )
        )}
      </div>

     {/* PAGINAÇÃO */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <p
          style={{
            color:
              "#8c8c8c",
            fontWeight:
              "500",
            margin: 0,
          }}
        >
          Mostrando {utilizadoresFiltrados.length} de {utilizadores.length}
          Utilizadores
        </p>

        <div className="d-flex gap-2">
          <button
            className="btn"
            style={{
              borderRadius:
                "25px",
              background:
                "#BFEFFF",
              padding:
                "10px 25px",
            }}
          >
            Anterior
          </button>

          <button
            className="btn"
            style={{
              borderRadius:
                "50%",
              width: "50px",
              height: "50px",
              background:
                "#10C4E8",
              color:
                "white",
              fontWeight:
                "bold",
            }}
          >
            1
          </button>

          <button
            className="btn"
            style={{
              borderRadius:
                "25px",
              background:
                "#BFEFFF",
              padding:
                "10px 25px",
            }}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}



