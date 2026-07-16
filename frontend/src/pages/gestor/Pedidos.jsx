import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";
import DynamicMetadataFields from "../../components/DynamicMetadataFields";
import { categoriasPedidos, pedidoCamposPorCategoria } from "../../config/dynamicFields";
import {
  FaSearch,
  FaEye,
  FaEdit,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaCommentDots,
  FaTimes,
  FaPlus,
} from "react-icons/fa";

export default function Pedidos() {
  const [mostrarVer, setMostrarVer] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [pedidoEditar, setPedidoEditar] = useState(null);
  const [pedidoVer, setPedidoVer] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [novoPedido, setNovoPedido] = useState({
    titulo: "",
    categoria: "",
    prioridade: "",
    estado: "",
    descricao: "",
    cliente: "",
    cliente_id: "",
    metadados: {},
  });
  const [mostrarRespostas, setMostrarRespostas] = useState(false);
  const [filtroPesquisa, setFiltroPesquisa] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroOrdenacao, setFiltroOrdenacao] = useState("");

  useEffect(() => {
    buscarPedidos();
    buscarClientes();
  }, []);

  async function buscarPedidos() {
    try {
      const response = await axios.get(`${API_URL}/pedidos`);
      setPedidos(response.data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  }

  async function buscarClientes() {
    try {
      const response = await axios.get(`${API_URL}/utilizadores`);
      setClientes(
        response.data.filter((utilizador) => utilizador.tipo === "Cliente")
      );
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  }

  async function criarPedido(event) {
    if (event) {
      event.preventDefault();
    }

    try {
      await axios.post(`${API_URL}/pedidos`, novoPedido);
      buscarPedidos();

      setNovoPedido({
        titulo: "",
        categoria: "",
        prioridade: "",
        estado: "",
        descricao: "",
        cliente: "",
        cliente_id: "",
        metadados: {},
      });

      setMostrarFormulario(false);
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
    }
  }

  async function editarPedido(id, dadosAtualizados) {
    try {
      const response = await axios.put(
        `${API_URL}/pedidos/${id}`,
        dadosAtualizados
      );
      buscarPedidos();
      return response.data;
    } catch (error) {
      console.error("Erro ao editar pedido:", error);
      return null;
    }
  }

  async function apagarResposta(pedidoId, index) {
    const pedidoAtual =
      pedidoVer?.id === pedidoId
        ? pedidoVer
        : pedidos.find((pedido) => pedido.id === pedidoId);

    const historico = pedidoAtual?.historico_respostas ?? [];
    if (!historico[index]) {
      return;
    }

    const novaLista = historico.filter(
      (_, itemIndex) => itemIndex !== index
    );

    const updated = await editarPedido(pedidoId, {
      titulo: pedidoAtual.titulo,
      categoria: pedidoAtual.categoria,
      prioridade: pedidoAtual.prioridade,
      estado: pedidoAtual.estado,
      descricao: pedidoAtual.descricao,
      cliente: pedidoAtual.cliente,
      cliente_id: pedidoAtual.cliente_id,
      historico_respostas: novaLista,
      respostasIncremento: -1,
    });

    if (!updated) {
      return;
    }

    setPedidos((prev) =>
      prev.map((pedido) =>
        pedido.id === pedidoId
          ? {
            ...pedido,
            historico_respostas: novaLista,
            respostas: Math.max((pedido.respostas ?? 0) - 1, 0),
          }
          : pedido
      )
    );

    if (pedidoVer?.id === pedidoId) {
      setPedidoVer(updated);
    }
  }

  function handleVerPedido(pedido) {
    setPedidoVer(pedido);
    setMostrarRespostas(false);
    setMostrarVer(true);
  }

  function handleEditarPedido(pedido) {
    setPedidoEditar({
      ...pedido,
      resposta: "",
      metadados: pedido.metadados || {},
    });
    setMostrarEditar(true);
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Resolvido":
        return "#BDF4C8";
      case "Pendente":
        return "#FFE5BE";
      default:
        return "#FFD9A8";
    }
  };

  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case "Alta":
        return "#FFD1D1";
      case "Baixa":
        return "#EAEAEA";
      default:
        return "#D9D6FE";
    }
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const pesquisa = filtroPesquisa.trim().toLowerCase();
    const pesquisaMatch =
      !pesquisa ||
      pedido.titulo?.toLowerCase().includes(pesquisa) ||
      pedido.descricao?.toLowerCase().includes(pesquisa) ||
      pedido.cliente?.toLowerCase().includes(pesquisa);

    const categoriaMatch =
      !filtroCategoria ||
      pedido.categoria === filtroCategoria;

    return pesquisaMatch && categoriaMatch;
  });

  const totalPedidos = pedidos.length;
  const pedidosAbertos = pedidos.filter((pedido) => pedido.estado !== "Resolvido").length;
  const pedidosResolvidos = pedidos.filter((pedido) => pedido.estado === "Resolvido").length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F3F4",
        borderRadius: "40px",
        padding: "35px",
      }}
    >
      {/* POPUP VER */}
      {mostrarVer && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "720px",
              background: "white",
              borderRadius: "25px",
              overflow: "hidden",
            }}
          >
            <div
              className="d-flex justify-content-between align-items-center"
              style={{
                padding: "25px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <h4>Detalhes do Pedido</h4>

              <FaTimes
                style={{ cursor: "pointer" }}
                onClick={() => setMostrarVer(false)}
              />
            </div>

            <div style={{ padding: "25px" }}>
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                  <h3 style={{ margin: 0 }}>{pedidoVer?.id ?? "#"}</h3>

                  <small style={{ color: "#777" }}>
                    Criado: {pedidoVer?.data_criacao ? new Date(pedidoVer.data_criacao).toLocaleDateString("pt-PT") : "-"}
                  </small>
                </div>

                <div className="d-flex gap-2">
                  <span
                    style={{
                      background: getEstadoColor(pedidoVer?.estado),
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontWeight: "600",
                    }}
                  >
                    {pedidoVer?.estado ?? "-"}
                  </span>

                  <span
                    style={{
                      background: getPrioridadeColor(pedidoVer?.prioridade),
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontWeight: "600",
                    }}
                  >
                    {pedidoVer?.prioridade ?? "-"}
                  </span>
                </div>
              </div>

              <h4>{pedidoVer?.titulo ?? "Título do pedido"}</h4>

              <p style={{ color: "#777" }}>
                Categoria: {pedidoVer?.categoria ?? "-"}
              </p>

              <div
                style={{
                  background: "#F4F7FB",
                  borderRadius: "20px",
                  padding: "20px",
                  marginTop: "20px",
                }}
              >
                <h5>Descrição do Pedido</h5>

                <p>{pedidoVer?.descricao ?? "Sem descrição disponível."}</p>
              </div>

              <div
                className="mt-4"
                style={{
                  background: "#F4F7FB",
                  borderRadius: "20px",
                  padding: "20px",
                }}
              >
                <h5>Atividade</h5>

                <ul>
                  <li>
                    Criado em {pedidoVer?.data_criacao ? new Date(pedidoVer.data_criacao).toLocaleDateString("pt-PT") : "-"}
                  </li>

                  <li>
                    Última atualização: {pedidoVer?.data_atualizacao ? new Date(pedidoVer.data_atualizacao).toLocaleDateString("pt-PT") : "-"}
                  </li>

                  <li
                    style={{
                      cursor: "pointer",
                      fontWeight: "600",
                      color: "#0C63E4",
                    }}
                    onClick={() => setMostrarRespostas((prev) => !prev)}
                  >
                    {pedidoVer?.respostas ?? 0} respostas
                    <span style={{ marginLeft: "8px", fontWeight: "400", color: "#4B5563" }}>
                      ({mostrarRespostas ? "ocultar" : "ver"})
                    </span>
                  </li>
                </ul>

                <button
                  className="btn"
                  style={{
                    background: "#12C4EB",
                    color: "white",
                    borderRadius: "20px",
                    padding: "10px 18px",
                    marginTop: "12px",
                    fontWeight: "600",
                  }}
                  onClick={() => setMostrarRespostas((prev) => !prev)}
                >
                  {mostrarRespostas ? "Ocultar respostas" : "Ver respostas"}
                </button>

                {mostrarRespostas && (
                  <div
                    style={{
                      marginTop: "20px",
                      background: "white",
                      borderRadius: "20px",
                      padding: "18px",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <h6
                      style={{
                        marginBottom: "12px",
                        fontWeight: "700",
                      }}
                    >
                      Histórico de respostas
                    </h6>

                    {(pedidoVer?.historico_respostas ?? []).length > 0 ? (
                      <ul style={{ paddingLeft: "18px", color: "#333" }}>
                        {(pedidoVer?.historico_respostas ?? []).map((item, index) => (
                          <li
                            key={index}
                            style={{
                              marginBottom: "10px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              gap: "12px",
                            }}
                          >
                            <div>
                              <span style={{ fontWeight: "600" }}>
                                {new Date(item.data).toLocaleString("pt-PT", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                                :
                              </span>
                              <span style={{ marginLeft: "8px" }}>{item.texto}</span>
                            </div>
                            <button
                              className="btn"
                              style={{
                                background: "#6B7280",
                                color: "white",
                                borderRadius: "20px",
                                padding: "6px 14px",
                                fontSize: "0.9rem",
                                minHeight: "36px",
                              }}
                              onClick={() => apagarResposta(pedidoVer?.id, index)}
                            >
                              Apagar
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ color: "#555", margin: 0 }}>
                        Não há respostas detalhadas guardadas para este pedido.
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="d-flex gap-3 mt-4">
                <button
                  className="btn flex-grow-1"
                  style={{
                    background: "#4D7BFF",
                    color: "white",
                    borderRadius: "15px",
                  }}
                  onClick={() => {
                    setMostrarVer(false);
                    setPedidoEditar({
                      ...pedidoVer,
                      resposta: "",
                    });
                    setMostrarEditar(true);
                  }}
                >
                  Editar Pedido
                </button>

                <button
                  className="btn btn-light"
                  onClick={() => setMostrarVer(false)}
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
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "720px",
              background: "white",
              borderRadius: "25px",
              overflow: "hidden",
            }}
          >
            <div
              className="d-flex justify-content-between align-items-center"
              style={{
                padding: "25px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <h4>Editar Pedido</h4>

              <FaTimes
                style={{ cursor: "pointer" }}
                onClick={() => setMostrarEditar(false)}
              />
            </div>

            <div style={{ padding: "25px" }}>
              <div className="mb-3">
                <label>Título</label>

                <input
                  className="form-control"
                  value={pedidoEditar?.titulo ?? ""}
                  onChange={(e) =>
                    setPedidoEditar({
                      ...pedidoEditar,
                      titulo: e.target.value,
                    })
                  }
                />
              </div>

              <div className="row">
                <div className="col-md-4">
                  <label>Estado</label>

                  <select
                    className="form-select"
                    value={pedidoEditar?.estado ?? ""}
                    onChange={(e) =>
                      setPedidoEditar({
                        ...pedidoEditar,
                        estado: e.target.value,
                      })
                    }
                  >
                    <option value="">Selecione</option>
                    <option value="Em Progresso">Em Progresso</option>
                    <option value="Resolvido">Resolvido</option>
                    <option value="Pendente">Pendente</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label>Prioridade</label>

                  <select
                    className="form-select"
                    value={pedidoEditar?.prioridade ?? ""}
                    onChange={(e) =>
                      setPedidoEditar({
                        ...pedidoEditar,
                        prioridade: e.target.value,
                      })
                    }
                  >
                    <option value="">Selecione</option>
                    <option value="Alta">Alta</option>
                    <option value="Normal">Normal</option>
                    <option value="Baixa">Baixa</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label>Categoria</label>

                  <select
                    className="form-select"
                    value={pedidoEditar?.categoria ?? ""}
                    onChange={(e) =>
                      setPedidoEditar({
                        ...pedidoEditar,
                        categoria: e.target.value,
                        metadados: {},
                      })
                    }
                  >
                    <option value="">Selecione</option>
                    {categoriasPedidos.map((categoriaItem) => (
                      <option key={categoriaItem} value={categoriaItem}>
                        {categoriaItem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <label>Descrição</label>

                <textarea
                  rows="6"
                  className="form-control"
                  value={pedidoEditar?.descricao ?? ""}
                  onChange={(e) =>
                    setPedidoEditar({
                      ...pedidoEditar,
                      descricao: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mt-3">
                <label>Resposta</label>

                <textarea
                  rows="4"
                  className="form-control"
                  placeholder="Escreva a resposta aqui..."
                  value={pedidoEditar?.resposta ?? ""}
                  onChange={(e) =>
                    setPedidoEditar({
                      ...pedidoEditar,
                      resposta: e.target.value,
                    })
                  }
                />
              </div>

              <div className="d-flex gap-3 mt-4">
                <button
                  className="btn flex-grow-1"
                  style={{
                    background: "#12C4EB",
                    color: "white",
                  }}
                  onClick={async () => {
                    if (!pedidoEditar?.id) {
                      return;
                    }

                    const historicoAtual =
                      Array.isArray(pedidoEditar.historico_respostas)
                        ? pedidoEditar.historico_respostas
                        : [];

                    const respostaNova =
                      pedidoEditar.resposta?.trim()
                        ? {
                          texto: pedidoEditar.resposta.trim(),
                          data: new Date().toISOString(),
                        }
                        : null;

                    const proximoHistorico = respostaNova
                      ? [...historicoAtual, respostaNova]
                      : historicoAtual;

                    const updated = await editarPedido(
                      pedidoEditar.id,
                      {
                        titulo: pedidoEditar.titulo,
                        categoria: pedidoEditar.categoria,
                        prioridade: pedidoEditar.prioridade,
                        estado: pedidoEditar.estado,
                        descricao: pedidoEditar.descricao,
                        cliente: pedidoEditar.cliente,
                        cliente_id: pedidoEditar.cliente_id,
                        historico_respostas: proximoHistorico,
                        respostasIncremento: respostaNova ? 1 : 0,
                      }
                    );

                    if (updated && pedidoVer?.id === pedidoEditar.id) {
                      setPedidoVer(updated);
                    }

                    setPedidos((prev) =>
                      prev.map((pedido) =>
                        pedido.id === pedidoEditar.id
                          ? {
                            ...pedido,
                            historico_respostas: proximoHistorico,
                            respostas: respostaNova
                              ? (pedido.respostas ?? 0) + 1
                              : pedido.respostas,
                          }
                          : pedido
                      )
                    );

                    setPedidoEditar({
                      ...pedidoEditar,
                      resposta: "",
                    });
                    setMostrarEditar(false);
                  }}
                >
                  Guardar Alterações
                </button>

                <button
                  className="btn btn-light"
                  onClick={() => setMostrarEditar(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1
            style={{
              fontWeight: "700",
              fontSize: "42px",
              margin: 0,
            }}
          >
            Pedidos do Gestor
          </h1>

          <p style={{ color: "#8b8b8b", marginTop: "8px" }}>
            Gerir tickets de suporte e comunicação
          </p>
        </div>

        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="btn d-flex align-items-center gap-2"
          style={{
            background: "#BFEFFF",
            borderRadius: "30px",
            padding: "12px 25px",
            fontWeight: "600",
          }}
        >
          <FaPlus />
          Novo Pedido
        </button>
      </div>

      {mostrarFormulario && (
        <form
          onSubmit={criarPedido}
          style={{
            background: "#DDF6FB",
            border: "2px solid #12C4EB",
            borderRadius: "35px",
            padding: "30px",
            marginBottom: "30px",
          }}
        >
          <h4
            style={{
              fontWeight: "700",
              marginBottom: "20px",
            }}
          >
            Criar Novo Pedido
          </h4>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Título</label>

              <input
                type="text"
                className="form-control"
                placeholder="Título do pedido"
                value={novoPedido.titulo}
                onChange={(e) =>
                  setNovoPedido({
                    ...novoPedido,
                    titulo: e.target.value,
                  })
                }
                style={{
                  borderRadius: "30px",
                  border: "2px solid #12C4EB",
                  padding: "12px 20px",
                  background: "white",
                }}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Cliente</label>

              <select
                className="form-select"
                value={novoPedido.cliente_id}
                onChange={(e) => {
                  const selected = clientes.find(
                    (cliente) => String(cliente.id) === e.target.value
                  );

                  setNovoPedido({
                    ...novoPedido,
                    cliente_id: e.target.value,
                    cliente: selected?.empresa || "",
                  });
                }}
                style={{
                  borderRadius: "30px",
                  border: "2px solid #12C4EB",
                  padding: "12px 20px",
                  background: "white",
                }}
              >
                <option value="">Selecione um cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.empresa} - {cliente.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label>Categoria</label>

              <select
                className="form-select"
                value={novoPedido.categoria}
                onChange={(e) =>
                  setNovoPedido({
                    ...novoPedido,
                    categoria: e.target.value,
                    metadados: {},
                  })
                }
                style={{
                  border: "2px solid #12C4EB",
                  borderRadius: "30px",
                  background: "white",
                  padding: "12px 20px",
                }}
              >
                <option value="">Selecionar</option>
                {categoriasPedidos.map((categoriaItem) => (
                  <option key={categoriaItem} value={categoriaItem}>
                    {categoriaItem}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-12 mb-3">
              <DynamicMetadataFields
                categoria={novoPedido.categoria}
                fieldsByCategory={pedidoCamposPorCategoria}
                value={novoPedido.metadados}
                onChange={(metadados) => setNovoPedido({ ...novoPedido, metadados })}
                inputStyle={{
                  border: "2px solid #12C4EB",
                  borderRadius: "30px",
                  background: "white",
                  padding: "12px 20px",
                }}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Prioridade</label>

              <select
                className="form-select"
                value={novoPedido.prioridade}
                onChange={(e) =>
                  setNovoPedido({
                    ...novoPedido,
                    prioridade: e.target.value,
                  })
                }
                style={{
                  border: "2px solid #12C4EB",
                  borderRadius: "30px",
                  background: "white",
                  padding: "12px 20px",
                }}
              >
                <option value="">Selecionar</option>
                <option value="Alta">Alta</option>
                <option value="Normal">Normal</option>
                <option value="Baixa">Baixa</option>
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <label>Estado</label>

              <select
                className="form-select"
                value={novoPedido.estado}
                onChange={(e) =>
                  setNovoPedido({
                    ...novoPedido,
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
                <option value="">Selecionar</option>
                <option value="Em Progresso">Em Progresso</option>
                <option value="Resolvido">Resolvido</option>
                <option value="Pendente">Pendente</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label>Descrição</label>

            <textarea
              rows="5"
              className="form-control"
              placeholder="Detalhes do pedido"
              value={novoPedido.descricao}
              onChange={(e) =>
                setNovoPedido({
                  ...novoPedido,
                  descricao: e.target.value,
                })
              }
              style={{
                border: "2px solid #12C4EB",
                borderRadius: "30px",
                padding: "20px",
                background: "white",
                minHeight: "170px",
              }}
            />
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
              Criar Pedido
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
              onClick={() => setMostrarFormulario(false)}
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
            title: "Total de Pedidos",
            value: totalPedidos,
            color: "#111",
          },
          {
            title: "Em Aberto",
            value: pedidosAbertos,
            color: "red",
          },
          {
            title: "Resolvidos",
            value: pedidosResolvidos,
            color: "#00B050",
          },
          {
            title: "Tempo Médio Resposta",
            value: "2h",
            color: "#4D7BFF",
          },
        ].map((card, index) => (
          <div className="col-lg-3" key={index}>
            <div
              style={{
                background: "#DDF6FB",
                borderRadius: "30px",
                padding: "28px",
                border: "2px solid #12C4EB",
              }}
            >
              <p
                style={{
                  color: "#7d7d7d",
                  marginBottom: "10px",
                  fontWeight: "500",
                }}
              >
                {card.title}
              </p>

              <h2
                style={{
                  fontWeight: "700",
                  fontSize: "42px",
                  color: card.color,
                  margin: 0,
                }}
              >
                {card.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* PESQUISA */}
      <div
        style={{
          background: "#10C4E8",
          borderRadius: "30px",
          padding: "20px",
          marginBottom: "25px",
        }}
      >
        <div className="row g-3">
          <div className="col-lg-7">
            <div
              style={{
                background: "#BFEFFF",
                borderRadius: "30px",
                padding: "12px 20px",
              }}
              className="d-flex align-items-center"
            >
              <FaSearch color="#7f7f7f" />

              <input
                type="text"
                placeholder="Pesquisar pedido..."
                value={filtroPesquisa}
                onChange={(e) => setFiltroPesquisa(e.target.value)}
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  width: "100%",
                  marginLeft: "10px",
                }}
              />
            </div>
          </div>

          <div className="col-lg-2">
            <select
              className="form-select"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              style={{
                height: "48px",
                borderRadius: "30px",
                backgroundColor: "#BFEFFF",
                border: "none",
              }}
            >
              <option value="">Todas as Categorias</option>
              {categoriasPedidos.map((categoriaItem) => (
                <option key={categoriaItem} value={categoriaItem}>
                  {categoriaItem}
                </option>
              ))}
            </select>
          </div>

          <div className="col-lg-3">
            <select
              className="form-select"
              value={filtroOrdenacao}
              onChange={(e) => setFiltroOrdenacao(e.target.value)}
              style={{
                height: "48px",
                borderRadius: "30px",
                backgroundColor: "#BFEFFF",
                border: "none",
              }}
            >
              <option value="">Ordenar por</option>
              <option value="maior-id">Mais recentes</option>
              <option value="menor-id">Mais antigos</option>
            </select>
          </div>
        </div>
      </div>

      {/* PEDIDOS */}
      <div className="d-flex flex-column gap-4">
        {pedidosFiltrados.map((pedido, index) => (
          <div
            key={index}
            style={{
              background: "#DDF6FB",
              border: "2px solid #12C4EB",
              borderRadius: "25px",
              padding: "20px",
            }}
          >
            <div className="d-flex justify-content-between">
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <h4 style={{ margin: 0, color: "#7d7d7d" }}>{pedido.id}</h4>

                <span
                  style={{
                    background: getEstadoColor(pedido.estado),
                    padding: "5px 14px",
                    borderRadius: "20px",
                    fontWeight: "600",
                  }}
                >
                  {pedido.estado}
                </span>

                <span
                  style={{
                    background: getPrioridadeColor(pedido.prioridade),
                    padding: "5px 14px",
                    borderRadius: "20px",
                    fontWeight: "600",
                  }}
                >
                  {pedido.prioridade}
                </span>
              </div>

              <div>
                {pedido.estado === "Resolvido" ? (
                  <FaCheckCircle color="green" />
                ) : (
                  <FaClock color="orange" />
                )}
              </div>
            </div>

            <div className="mt-3">
              <h5 style={{ marginBottom: "5px" }}>{pedido.titulo}</h5>

              <small style={{ color: "#7d7d7d" }}>
                Categoria: {pedido.categoria} | Criado: {pedido.data_criacao ? new Date(pedido.data_criacao).toLocaleDateString("pt-PT") : "-"} | Atualizado: {pedido.data_atualizacao ? new Date(pedido.data_atualizacao).toLocaleDateString("pt-PT") : "-"}
              </small>
            </div>

            <div
              className="d-flex justify-content-between align-items-center mt-4 pt-3"
              style={{ borderTop: "1px solid #B7EAF5" }}
            >
              <div className="d-flex align-items-center gap-2">
                <FaCommentDots color="#7d7d7d" />

                <span
                  style={{
                    color: "#7d7d7d",
                    fontWeight: "500",
                  }}
                >
                  {pedido.respostas} Respostas
                </span>
              </div>

              <div className="d-flex align-items-center gap-3">
                <FaEye
                  color="#4D7BFF"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleVerPedido(pedido)}
                />

                <FaEdit
                  color="#6A5CFF"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEditarPedido(pedido)}
                />

                <button
                  className="btn"
                  style={{
                    color: "#12C4EB",
                    fontWeight: "600",
                  }}
                  onClick={() => handleVerPedido(pedido)}
                >
                  Ver Detalhes <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINAÇÃO */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <p
          style={{
            color: "#8c8c8c",
            fontWeight: "500",
            margin: 0,
          }}
        >
          Mostrando {pedidosFiltrados.length} de {pedidos.length} Pedidos
        </p>

        <div className="d-flex gap-2">
          <button
            className="btn"
            style={{
              borderRadius: "25px",
              background: "#BFEFFF",
              padding: "10px 25px",
            }}
          >
            Anterior
          </button>

          <button
            className="btn"
            style={{
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              background: "#10C4E8",
              color: "white",
              fontWeight: "bold",
            }}
          >
            1
          </button>

          <button
            className="btn"
            style={{
              borderRadius: "25px",
              background: "#BFEFFF",
              padding: "10px 25px",
            }}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
