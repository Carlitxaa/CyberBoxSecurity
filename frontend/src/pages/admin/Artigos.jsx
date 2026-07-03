import {
  useState,
  useEffect,
} from "react";

import axios from "axios";
import { API_URL } from "../../config/api";
import {
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
} from "react-icons/fa";

export default function Artigos() {
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
    mostrarApagar,
    setMostrarApagar,
  ] = useState(false);

  const [
    artigoApagar,
    setArtigoApagar,
  ] = useState(null);

  const [
    artigoVer,
    setArtigoVer,
  ] = useState(null);

  const [
    artigoEditar,
    setArtigoEditar,
  ] = useState(null);

  const [
    artigos,
    setArtigos,
  ] = useState([]);

  const [
    pesquisa,
    setPesquisa,
  ] = useState("");

  const [
    filtroCategoria,
    setFiltroCategoria,
  ] = useState("");

  const [
    filtroEstado,
    setFiltroEstado,
  ] = useState("");

  const [
    imagemUrl,
    setImagemUrl,
  ] = useState("");

  const [
    imagemFile,
    setImagemFile,
  ] = useState(null);

  const [
    imagemEditarUrl,
    setImagemEditarUrl,
  ] = useState("");

  const [
    imagemEditarFile,
    setImagemEditarFile,
  ] = useState(null);

  const [
    novoArtigo,
    setNovoArtigo,
  ] = useState({
    titulo: "",
    categoria:
      "Segurança",
    autor: "",
    conteudo: "",
    estado:
      "Publicado",
    imagem: "",
  });

  useEffect(() => {
    async function buscarArtigos() {
      try {
        const response =
          await axios.get(
            `${API_URL}/artigos`
          );

        setArtigos(
          response.data
        );
      } catch (error) {
        console.error(
          "Erro ao buscar artigos:",
          error
        );
      }
    }

    buscarArtigos();
  }, []);

  async function criarArtigo() {
    try {
      const formData = new FormData();
      formData.append("titulo", novoArtigo.titulo);
      formData.append("categoria", novoArtigo.categoria);
      formData.append("autor", novoArtigo.autor);
      formData.append("conteudo", novoArtigo.conteudo);
      formData.append("estado", novoArtigo.estado);
      formData.append("imagem_url", imagemUrl || "");
      if (imagemFile) {
        formData.append("imagem", imagemFile);
      }

      await axios.post(
        `${API_URL}/artigos`,
        formData
      );

      const response =
        await axios.get(
          `${API_URL}/artigos`
        );

      setArtigos(
        response.data
      );

      setMostrarFormulario(
        false
      );

      setNovoArtigo({
        titulo: "",
        categoria:
          "Segurança",
        autor: "",
        conteudo: "",
        estado:
          "Publicado",
        imagem: "",
      });
      setImagemUrl("");
      setImagemFile(null);
    } catch (error) {
      console.error(
        "Erro ao criar artigo:",
        error
      );
    }
  }

  async function apagarArtigo() {
    try {
      await axios.delete(
        `${API_URL}/artigos/${artigoApagar.id}`
      );

      setArtigos(
        artigos.filter(
          (a) =>
            a.id !==
            artigoApagar.id
        )
      );

      setMostrarApagar(
        false
      );
    } catch (error) {
      console.error(
        "Erro ao apagar artigo:",
        error
      );
    }
  }

  async function editarArtigo() {
    try {
      const formData = new FormData();
      formData.append("titulo", artigoEditar.titulo);
      formData.append("categoria", artigoEditar.categoria);
      formData.append("autor", artigoEditar.autor);
      formData.append("conteudo", artigoEditar.conteudo);
      formData.append("estado", artigoEditar.estado);
      formData.append(
        "imagem_url",
        imagemEditarUrl || artigoEditar.imagem || ""
      );
      if (imagemEditarFile) {
        formData.append("imagem", imagemEditarFile);
      }

      await axios.put(
        `${API_URL}/artigos/${artigoEditar.id}`,
        formData
      );

      const response =
        await axios.get(
          `${API_URL}/artigos`
        );

      setArtigos(
        response.data
      );

      setMostrarEditar(
        false
      );
      setImagemEditarUrl("");
      setImagemEditarFile(null);
    } catch (error) {
      console.error(
        "Erro ao editar artigo:",
        error
      );
    }
  }

  return (
    <div
      style={{
        minHeight:
          "100vh",
        background:
          "#F5F3F4",
        borderRadius:
          "40px",
        padding: "35px",
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
              width: "700px",
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
              <h4
                style={{
                  margin: 0,
                  fontWeight:
                    "700",
                }}
              >
                Visualizar
                Artigo
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
              <h2
                style={{
                  fontWeight:
                    "700",
                  marginBottom:
                    "15px",
                }}
              >
                {
                  artigoVer?.titulo
                }
              </h2>

              <p
                style={{
                  color:
                    "#666",
                }}
              >
                Por {
                  artigoVer?.autor
                }
                {" • "}
                {
                  artigoVer?.data_criacao
                    ? new Date(
                      artigoVer.data_criacao
                    ).toLocaleDateString(
                      "pt-PT"
                    )
                    : ""
                }
                {" • "}
                {
                  artigoVer?.estado
                }
                {" • "}
                {
                  artigoVer?.views
                } visualizações

              </p>

              <p>
                <p>
                  {
                    artigoVer?.conteudo
                  }
                </p>
              </p>



              <hr />

              <h5>
                Metadados
              </h5>

              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>
                      Categoria:
                    </strong>{" "}
                    {
                      artigoVer?.categoria
                    }
                  </p>

                  <p>
                    <strong>
                      Data:
                    </strong>{" "}
                    {
                      artigoVer?.data_criacao
                        ? new Date(
                          artigoVer.data_criacao
                        ).toLocaleDateString(
                          "pt-PT"
                        )
                        : ""
                    }
                  </p>
                </div>

                <div className="col-md-6">
                  <p>
                    <strong>
                      Autor:
                    </strong>{" "}
                    {
                      artigoVer?.autor
                    }
                  </p>

                  <p>
                    <strong>
                      Visualizações:
                    </strong>{" "}
                    {
                      artigoVer?.views
                    }
                  </p>
                </div>
              </div>

              <div className="d-flex gap-3 mt-4">
                <button
                  className="btn flex-grow-1"
                  style={{
                    background:
                      "#4D7BFF",
                    color:
                      "white",
                    borderRadius:
                      "12px",
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
                  Artigo
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
              width: "700px",
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
              <h4
                style={{
                  margin: 0,
                  fontWeight:
                    "700",
                }}
              >
                Editar
                Artigo
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
                  Título do
                  Artigo
                </label>

                <input
                  className="form-control"
                  value={
                    artigoEditar?.titulo || ""
                  }
                  onChange={(e) =>
                    setArtigoEditar({
                      ...artigoEditar,
                      titulo:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label>
                    Categoria
                  </label>
                  <select
                    className="form-select"
                    value={artigoEditar?.categoria || ""}
                    onChange={(e) =>
                      setArtigoEditar({
                        ...artigoEditar,
                        categoria: e.target.value,
                      })
                    }
                  >
                    <option>Segurança</option>
                    <option>Compliance</option>
                    <option>Cloud</option>
                    <option>Arquitetura</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label>
                    Estado
                  </label>

                  <select
                    className="form-select"
                    value={artigoEditar?.estado || ""}
                    onChange={(e) =>
                      setArtigoEditar({
                        ...artigoEditar,
                        estado: e.target.value,
                      })
                    }
                  >
                    <option>Publicado</option>
                    <option>Rascunho</option>
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <label>
                  Autor
                </label>

                <input
                  className="form-control"
                  value={
                    artigoEditar?.autor || ""
                  }
                  onChange={(e) =>
                    setArtigoEditar({
                      ...artigoEditar,
                      autor:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="mt-3">
                <label>
                  Conteúdo do
                  Artigo
                </label>

                <textarea
                  rows="8"
                  className="form-control"
                  value={
                    artigoEditar?.conteudo || ""
                  }
                  onChange={(e) =>
                    setArtigoEditar({
                      ...artigoEditar,
                      conteudo:
                        e.target.value,
                    })
                  }
                />
              </div>
              <div className="mt-3">
                <label>
                  Imagem (URL ou ficheiro)
                </label>

                <input
                  type="url"
                  className="form-control"
                  placeholder="URL da imagem"
                  value={imagemEditarUrl}
                  onChange={(e) =>
                    setImagemEditarUrl(e.target.value)
                  }
                  style={{
                    borderRadius:
                      "30px",
                    border:
                      "2px solid #12C4EB",
                    padding:
                      "12px 20px",
                  }}
                />

                <input
                  type="file"
                  accept="image/*"
                  className="form-control mt-2"
                  onChange={(e) =>
                    setImagemEditarFile(
                      e.target.files[0] || null
                    )
                  }
                  style={{
                    borderRadius:
                      "30px",
                    border:
                      "2px solid #12C4EB",
                    padding:
                      "12px 20px",
                  }}
                />
              </div>

              <div
                className="mt-4"
                style={{
                  background:
                    "#F7F7F7",
                  padding:
                    "20px",
                  borderRadius:
                    "15px",
                }}
              >
                <h6>
                  SEO &
                  Metadados
                </h6>

                <input
                  className="form-control mb-3"
                  placeholder="Breve descrição para SEO..."
                />

                <input
                  className="form-control"
                  placeholder="cibersegurança, proteção, dados..."
                />
              </div>

              <div className="d-flex gap-3 mt-4">
                <button
                  type="button"
                  className="btn flex-grow-1"
                  onClick={
                    editarArtigo
                  }
                  style={{
                    background:
                      "#12C4EB",
                    color:
                      "white",
                    borderRadius:
                      "12px",
                  }}
                >
                  Guardar Alterações
                </button>

                <button
                  className="btn btn-light"
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
                "20px",
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
              }}
            >
              Tem certeza que
              quer apagar este
              artigo?
            </p>

            <div className="d-flex gap-3 mt-4">
              <button
                className="btn btn-light flex-grow-1"
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
                onClick={() => apagarArtigo()}
              >
                Apagar
              </button>
            </div>
          </div>
        </div>
      )}      {/* HEADER */}
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
            Gestão de Artigos
          </h1>

          <p
            style={{
              color:
                "#8b8b8b",
              marginTop:
                "8px",
            }}
          >
            Criar, editar e gerir artigos do blog
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
          Novo Artigo
        </button>
      </div>


      {/* NOVO ARTIGO */}
      {mostrarFormulario && (
        <div
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
          <h2
            style={{
              fontWeight:
                "700",
              marginBottom:
                "30px",
            }}
          >
            Criar Novo
            Artigo
          </h2>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label>
                Título do
                Artigo
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Título do artigo"
                value={
                  novoArtigo.titulo
                }
                onChange={(e) =>
                  setNovoArtigo({
                    ...novoArtigo,
                    titulo:
                      e.target.value,
                  })
                }
                style={{
                  borderRadius:
                    "30px",
                  border:
                    "2px solid #12C4EB",
                  padding:
                    "12px 20px",
                }}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>
                Autor
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Nome do autor"
                value={
                  novoArtigo.autor
                }
                onChange={(e) =>
                  setNovoArtigo({
                    ...novoArtigo,
                    autor:
                      e.target.value,
                  })
                }
                style={{
                  borderRadius:
                    "30px",
                  border:
                    "2px solid #12C4EB",
                  padding:
                    "12px 20px",
                }}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>
                Imagem (URL ou ficheiro)
              </label>

              <div className="d-flex gap-2">
                <input
                  type="url"
                  className="form-control"
                  placeholder="URL da imagem"
                  value={imagemUrl}
                  onChange={(e) =>
                    setImagemUrl(e.target.value)
                  }
                  style={{
                    borderRadius:
                      "30px",
                    border:
                      "2px solid #12C4EB",
                    padding:
                      "12px 20px",
                  }}
                />
              </div>

              <input
                type="file"
                accept="image/*"
                className="form-control mt-2"
                onChange={(e) =>
                  setImagemFile(
                    e.target.files[0] || null
                  )
                }
                style={{
                  borderRadius:
                    "30px",
                  border:
                    "2px solid #12C4EB",
                  padding:
                    "12px 20px",
                }}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>
                Categoria
              </label>

              <select
                className="form-select"
                value={novoArtigo.categoria}
                onChange={(e) =>
                  setNovoArtigo({
                    ...novoArtigo,
                    categoria:
                      e.target.value,
                  })
                }
                style={{
                  borderRadius:
                    "30px",
                  border:
                    "2px solid #12C4EB",
                  padding:
                    "12px 20px",
                }}
              >
                <option>
                  Segurança
                </option>

                <option>
                  Compliance
                </option>

                <option>
                  Cloud
                </option>

                <option>
                  Arquitetura
                </option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label>
                Estado
              </label>

              <select
                className="form-select"
                value={novoArtigo.estado}
                onChange={(e) =>
                  setNovoArtigo({
                    ...novoArtigo,
                    estado:
                      e.target.value,
                  })
                }
                style={{
                  borderRadius:
                    "30px",
                  border:
                    "2px solid #12C4EB",
                  padding:
                    "12px 20px",
                }}
              >
                <option>
                  Publicado
                </option>

                <option>
                  Rascunho
                </option>
              </select>
            </div>

            <div className="col-12 mb-4">
              <label>
                Conteúdo do
                Artigo
              </label>

              <textarea
                rows="8"
                className="form-control"
                placeholder="Escreve aqui o conteúdo do artigo..."
                value={novoArtigo.conteudo}
                onChange={(e) =>
                  setNovoArtigo({
                    ...novoArtigo,
                    conteudo:
                      e.target.value,
                  })
                }
                style={{
                  borderRadius:
                    "20px",
                  border:
                    "2px solid #12C4EB",
                  padding:
                    "20px",
                }}
              />
            </div>
          </div>

          <div className="d-flex gap-3">
            <button
              type="button"
              className="btn"
              onClick={
                criarArtigo
              }
              style={{
                background:
                  "#12C4EB",
                color:
                  "white",
                borderRadius:
                  "30px",
                padding:
                  "12px 30px",
                fontWeight:
                  "600",
              }}
            >
              Criar Artigo
            </button>

            <button
              className="btn"
              style={{
                background:
                  "#6B7280",
                color:
                  "white",
                borderRadius:
                  "30px",
                padding:
                  "12px 30px",
                fontWeight:
                  "600",
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
        </div>
      )}

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
                placeholder="Pesquisar artigos..."
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
              value={filtroCategoria}
              onChange={(e) =>
                setFiltroCategoria(
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
              <option value="">
                Todas as Categorias
              </option>

              <option value="Segurança">
                Segurança
              </option>

              <option value="Compliance">
                Compliance
              </option>

              <option value="Cloud">
                Cloud
              </option>

              <option value="Arquitetura">
                Arquitetura
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
              <option value="">
                Todos os Estados
              </option>

              <option value="Publicado">
                Publicado
              </option>

              <option value="Rascunho">
                Rascunho
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
            Título
          </div>
          <div className="col">
            Categoria
          </div>
          <div className="col">
            Autor
          </div>
          <div className="col">
            Data
          </div>
          <div className="col">
            Estado
          </div>
          <div className="col">
            Visualizações
          </div>
          <div className="col">
            Ações
          </div>
        </div>

        {
          artigos
            .filter((artigo) => {
              const matchPesquisa =
                artigo.titulo
                  ?.toLowerCase()
                  .includes(
                    pesquisa.toLowerCase()
                  );

              const matchCategoria =
                filtroCategoria ===
                "" ||
                artigo.categoria ===
                filtroCategoria;

              const matchEstado =
                filtroEstado ===
                "" ||
                artigo.estado ===
                filtroEstado;

              return (
                matchPesquisa &&
                matchCategoria &&
                matchEstado
              );
            })
            .map(
              (
                artigo,
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
                        artigos.length - 1
                        ? "2px solid #12C4EB"
                        : "none",
                  }}
                >
                  <div className="col-3 text-start">
                    {artigo.titulo}
                  </div>

                  <div className="col">
                    <span
                      style={{
                        background:
                          "#12C4EB",
                        color:
                          "#0B4A5A",
                        padding:
                          "5px 14px",
                        borderRadius:
                          "20px",
                        fontSize:
                          "14px",
                        fontWeight:
                          "500",
                      }}
                    >
                      {
                        artigo.categoria
                      }
                    </span>
                  </div>

                  <div className="col">
                    {artigo.autor}
                  </div>

                  <div className="col">
                    {
                      artigo.data_criacao
                        ? new Date(
                          artigo.data_criacao
                        ).toLocaleDateString(
                          "pt-PT"
                        )
                        : ""
                    }
                  </div>

                  <div className="col">
                    <span
                      style={{
                        background:
                          artigo.estado ===
                            "Publicado"
                            ? "#42E66E"
                            : "#FFD966",

                        color:
                          "white",

                        padding:
                          "5px 14px",

                        borderRadius:
                          "20px",

                        fontSize:
                          "14px",

                        fontWeight:
                          "600",
                      }}
                    >
                      {
                        artigo.estado
                      }
                    </span>
                  </div>

                  <div className="col">
                    {artigo.views}
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
                          setArtigoVer(
                            artigo
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
                          setArtigoEditar(
                            artigo
                          );
                          setImagemEditarUrl(
                            artigo.imagem || ""
                          );
                          setImagemEditarFile(
                            null
                          );

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
                          setArtigoApagar(
                            artigo
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
          Mostrando{" "}
          {artigos.length} de{" "}
          {artigos.length}
          {" "}Artigos
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
              border:
                "2px solid transparent",
              transition:
                "0.2s",
            }}
            onMouseEnter={(e) =>
              e.currentTarget.style.border =
              "2px solid #12C4EB"
            }
            onMouseLeave={(e) =>
              e.currentTarget.style.border =
              "2px solid transparent"
            }
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
              border:
                "2px solid transparent",
              transition:
                "0.2s",
            }}
            onMouseEnter={(e) =>
              e.currentTarget.style.border =
              "2px solid #12C4EB"
            }
            onMouseLeave={(e) =>
              e.currentTarget.style.border =
              "2px solid transparent"
            }
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}


