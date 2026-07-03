import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";
import {
  FaSearch,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaTimes,
  FaPlus,
} from "react-icons/fa";
import { getCurrentUser } from "../../utils/auth";

export default function Pedidos() {
  const navigate = useNavigate();
  const [currentUser] = useState(() => getCurrentUser());
  const [mostrarVer, setMostrarVer] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [pedidoVer, setPedidoVer] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [novoPedido, setNovoPedido] = useState({
    titulo: "",
    categoria: "",
    descricao: "",
  });
  const [mostrarRespostas, setMostrarRespostas] = useState(false);
  const [filtroPesquisa, setFiltroPesquisa] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  useEffect(() => {
    if (!currentUser || currentUser.tipo !== "Cliente") {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!currentUser) return;

    (async () => {
      try {
        const response = await axios.get(`${API_URL}/pedidos`, {
          params: { cliente: currentUser.empresa },
        });
        setPedidos(response.data);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      }
    })();
  }, [currentUser]);

  async function buscarPedidos() {
    try {
      const response = await axios.get(`${API_URL}/pedidos`, {
        params: { cliente: currentUser.empresa },
      });
      setPedidos(response.data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  }

  async function criarPedido(event) {
    event.preventDefault();
    if (!novoPedido.titulo || !novoPedido.categoria || !novoPedido.descricao) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      await axios.post(`${API_URL}/pedidos`, {
        titulo: novoPedido.titulo,
        categoria: novoPedido.categoria,
        prioridade: "Normal",
        estado: "Pendente",
        descricao: novoPedido.descricao,
        cliente: currentUser.empresa,
        respostas: 0,
        historico_respostas: [],
      });
      setNovoPedido({ titulo: "", categoria: "", descricao: "" });
      setMostrarFormulario(false);
      buscarPedidos();
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      alert("Não foi possível enviar o pedido.");
    }
  }

  function handleVerPedido(pedido) {
    setPedidoVer(pedido);
    setMostrarVer(true);
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Resolvido":
        return "#BDF4C8";
      case "Pendente":
        return "#FFE5BE";
      case "Em Progresso":
        return "#B3E0FF";
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
      pedido.descricao?.toLowerCase().includes(pesquisa);

    const categoriaMatch = !filtroCategoria || pedido.categoria === filtroCategoria;
    return pesquisaMatch && categoriaMatch;
  });

  const totalPedidos = pedidos.length;
  const pedidosAbertos = pedidos.filter((pedido) => pedido.estado !== "Resolvido").length;
  const pedidosResolvidos = pedidos.filter((pedido) => pedido.estado === "Resolvido").length;

  return (
    <div style={{ minHeight: "100vh", background: "#F5F3F4", borderRadius: "40px", padding: "35px" }}>
      {/* POPUP VER */}
      {mostrarVer && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
          <div style={{ width: "720px", background: "white", borderRadius: "25px", overflow: "hidden" }}>
            <div className="d-flex justify-content-between align-items-center" style={{ padding: "25px", borderBottom: "1px solid #ddd" }}>
              <h4>Detalhes do Pedido</h4>
              <FaTimes style={{ cursor: "pointer" }} onClick={() => setMostrarVer(false)} />
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
                  <span style={{ background: getEstadoColor(pedidoVer?.estado), padding: "6px 14px", borderRadius: "20px", fontWeight: "600" }}>
                    {pedidoVer?.estado ?? "-"}
                  </span>
                  <span style={{ background: getPrioridadeColor(pedidoVer?.prioridade), padding: "6px 14px", borderRadius: "20px", fontWeight: "600" }}>
                    {pedidoVer?.prioridade ?? "-"}
                  </span>
                </div>
              </div>

              <h4>{pedidoVer?.titulo ?? "Título do pedido"}</h4>
              <p style={{ color: "#777" }}>Categoria: {pedidoVer?.categoria ?? "-"}</p>

              <div style={{ background: "#F4F7FB", borderRadius: "20px", padding: "20px", marginTop: "20px" }}>
                <h5>Descrição do Pedido</h5>
                <p>{pedidoVer?.descricao ?? "Sem descrição disponível."}</p>
              </div>

              <div className="mt-4" style={{ background: "#F4F7FB", borderRadius: "20px", padding: "20px" }}>
                <h5>Atividade</h5>
                <ul>
                  <li>Criado em {pedidoVer?.data_criacao ? new Date(pedidoVer.data_criacao).toLocaleDateString("pt-PT") : "-"}</li>
                  <li style={{ cursor: "pointer", fontWeight: "600", color: "#0C63E4" }} onClick={() => setMostrarRespostas((prev) => !prev)}>
                    {pedidoVer?.respostas ?? 0} respostas ({mostrarRespostas ? "ocultar" : "ver"})
                  </li>
                </ul>

                {mostrarRespostas && (
                  <div style={{ marginTop: "20px", background: "white", borderRadius: "20px", padding: "18px", border: "1px solid #E2E8F0" }}>
                    <h6 style={{ marginBottom: "12px", fontWeight: "700" }}>Histórico de respostas</h6>
                    {(pedidoVer?.historico_respostas ?? []).length > 0 ? (
                      <ul style={{ paddingLeft: "18px", color: "#333" }}>
                        {(pedidoVer?.historico_respostas ?? []).map((item, index) => (
                          <li key={index} style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                            <div>
                              <span style={{ fontWeight: "600" }}>
                                {new Date(item.data).toLocaleString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}:
                              </span>
                              <span style={{ marginLeft: "8px" }}>{item.texto}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ color: "#999" }}>Sem respostas ainda.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="d-flex gap-3 mt-4">
                <button className="btn btn-light flex-grow-1" onClick={() => setMostrarVer(false)}>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 style={{ fontWeight: "700", fontSize: "42px", margin: 0 }}>Gestão de Pedidos</h1>
          <p style={{ color: "#8b8b8b", marginTop: "8px" }}>Criar e acompanhar seus pedidos de suporte</p>
        </div>
        <button
          onClick={() => setMostrarFormulario((prev) => !prev)}
          className="btn d-flex align-items-center gap-2"
          style={{ background: "#BFEFFF", borderRadius: "30px", padding: "12px 25px", fontWeight: "600", color: "#0F7F9D" }}
        >
          <FaPlus />
          {mostrarFormulario ? "Cancelar" : "Novo Pedido"}
        </button>
      </div>

      {/* FORMULÁRIO NOVO PEDIDO */}
      {mostrarFormulario && (
        <div
          style={{
            background: "#DDF6FB",
            border: "2px solid #12C4EB",
            borderRadius: "35px",
            padding: "30px",
            marginBottom: "30px",
          }}
        >
          <h4 style={{ fontWeight: "700", marginBottom: "20px" }}>Criar novo pedido</h4>
          <form onSubmit={criarPedido}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Título</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Título do pedido"
                  value={novoPedido.titulo}
                  onChange={(e) => setNovoPedido((prev) => ({ ...prev, titulo: e.target.value }))}
                  style={{
                    borderRadius: "30px",
                    border: "2px solid #12C4EB",
                    padding: "12px 20px",
                    background: "white",
                  }}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label>Categoria</label>
                <select
                  className="form-select"
                  value={novoPedido.categoria}
                  onChange={(e) => setNovoPedido((prev) => ({ ...prev, categoria: e.target.value }))}
                  style={{
                    border: "2px solid #12C4EB",
                    borderRadius: "30px",
                    background: "white",
                    padding: "12px 20px",
                  }}
                >
                  <option value="">Selecionar</option>
                  <option value="Suporte">Suporte</option>
                  <option value="Relatório">Relatório</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label>Descrição</label>
              <textarea
                className="form-control"
                rows={5}
                placeholder="Detalhes do pedido"
                value={novoPedido.descricao}
                onChange={(e) => setNovoPedido((prev) => ({ ...prev, descricao: e.target.value }))}
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
                className="btn"
                type="submit"
                style={{
                  background: "#12C4EB",
                  color: "white",
                  borderRadius: "30px",
                  padding: "12px 30px",
                  fontWeight: "600",
                }}
              >
                Enviar Pedido
              </button>

              <button
                className="btn"
                type="button"
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
        </div>
      )}

      {/* CARDS */}
      <div className="row g-4 mb-4">
        {[
          { title: "Total de Pedidos", value: totalPedidos, color: "#111" },
          { title: "Abertos", value: pedidosAbertos, color: "red" },
          { title: "Resolvidos", value: pedidosResolvidos, color: "#00B050" },
        ].map((card, index) => (
          <div className="col-lg-4" key={index}>
            <div style={{ background: "#DDF6FB", borderRadius: "30px", padding: "28px", border: "2px solid #12C4EB" }}>
              <p style={{ color: "#7d7d7d", marginBottom: "10px", fontWeight: "500" }}>{card.title}</p>
              <h2 style={{ fontWeight: "700", fontSize: "42px", color: card.color, margin: 0 }}>{card.value}</h2>
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
          marginBottom: "30px",
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
              <option value="Suporte">Suporte</option>
              <option value="Relatório">Relatório</option>
              <option value="Outro">Outro</option>
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
                <span style={{ background: getEstadoColor(pedido.estado), padding: "5px 14px", borderRadius: "20px", fontWeight: "600" }}>
                  {pedido.estado}
                </span>
                <span style={{ background: getPrioridadeColor(pedido.prioridade), padding: "5px 14px", borderRadius: "20px", fontWeight: "600" }}>
                  {pedido.prioridade}
                </span>
              </div>
              <div>
                {pedido.estado === "Resolvido" ? <FaCheckCircle color="green" /> : <FaClock color="orange" />}
              </div>
            </div>

            <div className="mt-3">
              <h5 style={{ marginBottom: "5px" }}>{pedido.titulo}</h5>
              <small style={{ color: "#777" }}>
                Categoria: {pedido.categoria} | Criado: {new Date(pedido.data_criacao || pedido.data).toLocaleDateString("pt-PT")} | Respostas: {pedido.respostas || 0}
              </small>
            </div>

            <div className="d-flex gap-2 mt-3">
              <button
                className="btn"
                style={{ background: "#12C4EB", color: "white", borderRadius: "20px", padding: "8px 16px", fontWeight: "600" }}
                onClick={() => handleVerPedido(pedido)}
              >
                <FaEye className="me-2" />
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {pedidosFiltrados.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
          Nenhum pedido encontrado.
        </div>
      )}
    </div>
  );
}

