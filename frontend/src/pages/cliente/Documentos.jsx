import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config/api";
import { FaSearch, FaDownload, FaFilePdf, FaPlus, FaUpload, FaTimes } from "react-icons/fa";
import { getCurrentUser } from "../../utils/auth";

export default function Documentos() {
  const navigate = useNavigate();
  const [currentUser] = useState(() => getCurrentUser());
  const [mostrarModal, setMostrarModal] = useState(false);
  const [documentos, setDocumentos] = useState([]);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const documentosPorPagina = 6;
  const [ficheiro, setFicheiro] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!currentUser || currentUser.tipo !== "Cliente") {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!currentUser) return;
    axios.get(`${API_URL}/documentos`, { params: { cliente: currentUser.empresa } })
      .then((response) => setDocumentos(response.data))
      .catch((error) => console.error("Erro ao buscar documentos:", error));
  }, [currentUser]);

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    setFicheiro(e.target.files?.[0] || null);
  }

  async function criarDocumento() {
    if (!nome || !categoria || !ficheiro) {
      alert("Preencha todos os campos e selecione um ficheiro.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("categoria", categoria);
      formData.append("cliente", currentUser.empresa);
      formData.append("cliente_id", currentUser.id);
      formData.append("enviado_por", currentUser.nome);
      formData.append("ficheiro", ficheiro);

      await axios.post(`${API_URL}/documentos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNome("");
      setCategoria("");
      setFicheiro(null);
      setMostrarModal(false);

      const response = await axios.get(`${API_URL}/documentos`, {
        params: { cliente: currentUser.empresa },
      });
      setDocumentos(response.data);
    } catch (error) {
      console.error("Erro ao criar documento:", error);
      alert("Erro ao enviar o documento.");
    }
  }

  async function baixarDocumento(doc) {
    if (!doc.ficheiro) {
      alert("Ficheiro não disponível para download.");
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/documentos/${doc.id}/download`, { responseType: "blob" });
      await axios.put(`${API_URL}/documentos/${doc.id}/download`);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.ficheiro;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setDocumentos(documentos.map(d => d.id === doc.id ? { ...d, downloads: (d.downloads || 0) + 1 } : d));
    } catch (error) {
      console.error("Erro ao baixar ficheiro:", error);
      alert("Erro ao descarregar o ficheiro.");
    }
  }

  const documentosFiltrados = documentos.filter((doc) => {
    const matchPesquisa = doc.nome.toLowerCase().includes(pesquisa.toLowerCase());
    const matchCategoria = filtroCategoria === "" || doc.categoria === filtroCategoria;
    return matchPesquisa && matchCategoria;
  });

  const totalPaginas = Math.max(1, Math.ceil(documentosFiltrados.length / documentosPorPagina));
  const paginaAtualCorrigida = Math.min(paginaAtual, totalPaginas);
  const ultimoDocumento = paginaAtualCorrigida * documentosPorPagina;
  const primeiroDocumento = ultimoDocumento - documentosPorPagina;
  const documentosPagina = documentosFiltrados.slice(primeiroDocumento, ultimoDocumento);

  function mudarPagina(novaPagina) {
    if (novaPagina < 1 || novaPagina > totalPaginas) return;
    setPaginaAtual(novaPagina);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F5F3F4", borderRadius: "40px", padding: "35px", position: "relative" }}>
      {/* MODAL */}
      {mostrarModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", background: "rgba(0,0,0,0.35)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
          <div style={{ width: "500px", background: "white", borderRadius: "20px", overflow: "hidden" }}>
            <div className="d-flex justify-content-between align-items-center" style={{ padding: "25px", borderBottom: "1px solid #ddd" }}>
              <h4 style={{ margin: 0, fontWeight: "700" }}>Enviar Novo Documento</h4>
              <FaTimes style={{ cursor: "pointer" }} onClick={() => setMostrarModal(false)} />
            </div>
            <div style={{ padding: "25px" }}>
              <label style={{ fontWeight: "600" }}>Ficheiro *</label>
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.xlsx,image/*" style={{ display: "none" }} onChange={handleFileChange} />
              <div onClick={openFilePicker} style={{ border: "2px dashed #D5DCE6", borderRadius: "15px", padding: "35px", textAlign: "center", marginTop: "10px", marginBottom: "20px", cursor: "pointer" }}>
                <FaUpload style={{ fontSize: "40px", color: "#94A3B8", marginBottom: "10px" }} />
                <p style={{ margin: 0, fontWeight: "500" }}>Clique para selecionar um ficheiro</p>
                <small style={{ color: "#64748B" }}>PDF, DOCX, XLSX, imagens (máx. 10MB)</small>
              </div>
              {ficheiro && <p style={{ marginTop: "10px", color: "#0B4A5A", fontWeight: "600" }}>Ficheiro selecionado: {ficheiro.name}</p>}

              <div className="mb-3">
                <label>Nome do Documento *</label>
                <input type="text" className="form-control" placeholder="Ex: Relatório de Segurança Q1 2026" value={nome} onChange={(e) => setNome(e.target.value)} style={{ borderRadius: "10px" }} />
              </div>

              <div className="row">
                <div className="col-md-12">
                  <label>Categoria</label>
                  <select className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ borderRadius: "10px" }}>
                    <option value="">Selecionar</option>
                    <option value="Relatórios">Relatórios</option>
                    <option value="Documentação">Documentação</option>
                    <option value="Pen Tests">Pen Tests</option>
                    <option value="Incidentes">Incidentes</option>
                    <option value="Políticas">Políticas</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>

              <div style={{ background: "#EEF4FF", padding: "15px", borderRadius: "12px", marginTop: "20px", color: "#1E40AF", fontSize: "14px" }}>
                ℹ O documento será armazenado de forma segura e ficará disponível para todos os membros da empresa.
              </div>

              <div className="d-flex gap-2 mt-4">
                <button className="btn btn-light flex-grow-1" onClick={() => setMostrarModal(false)}>Cancelar</button>
                <button className="btn text-white flex-grow-1" style={{ background: "#12C4EB", borderRadius: "12px" }} onClick={criarDocumento}>Enviar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 style={{ fontWeight: "700", fontSize: "42px", margin: 0 }}>Gestão de Documentos</h1>
          <p style={{ color: "#8b8b8b", marginTop: "8px" }}>Documentos disponíveis para download</p>
        </div>
        <button onClick={() => setMostrarModal(true)} className="btn d-flex align-items-center gap-2" style={{ background: "#BFEFFF", borderRadius: "30px", padding: "12px 25px", fontWeight: "600" }}>
          <FaPlus /> Upload Documento
        </button>
      </div>

      {/* CARDS */}
      <div className="row g-4 mb-4">
        {[
          { title: "Total Documentos", value: documentos.length },
          { title: "Downloads", value: documentos.reduce((total, doc) => total + (doc.downloads || 0), 0) },
          { title: "Categorias", value: new Set(documentos.map((doc) => doc.categoria)).size },
          { title: "Enviados por", value: new Set(documentos.map((doc) => doc.enviado_por)).size },
        ].map((card, index) => (
          <div className="col-lg-3" key={index}>
            <div style={{ background: "#DDF6FB", borderRadius: "30px", padding: "28px", border: "2px solid #12C4EB", textAlign: "center" }}>
              <h2 style={{ fontWeight: "700", fontSize: "42px", marginBottom: "10px" }}>{card.value}</h2>
              <p style={{ margin: 0, color: "#6B7280" }}>{card.title}</p>
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
                placeholder="Pesquisar documento..."
                value={pesquisa}
                onChange={(e) => {
                  setPesquisa(e.target.value);
                  setPaginaAtual(1);
                }}
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

          <div className="col-lg-5">
            <select
              className="form-select"
              value={filtroCategoria}
              onChange={(e) => {
                setFiltroCategoria(e.target.value);
                setPaginaAtual(1);
              }}
              style={{
                height: "48px",
                borderRadius: "30px",
                backgroundColor: "#BFEFFF",
                border: "none",
              }}
            >
              <option value="">Todas as Categorias</option>
              <option value="Relatórios">Relatórios</option>
              <option value="Documentação">Documentação</option>
              <option value="Pen Tests">Pen Tests</option>
              <option value="Incidentes">Incidentes</option>
              <option value="Políticas">Políticas</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
        </div>
      </div>

      {/* DOCUMENTOS */}
      <div className="row g-4 mb-4">
        {documentosPagina.map((doc, index) => (
          <div className="col-lg-4" key={index}>
            <div style={{ background: "#DDF6FB", border: "2px solid #12C4EB", borderRadius: "25px", padding: "20px", height: "100%" }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <FaFilePdf color="red" />
                <h6 style={{ margin: 0, fontWeight: "600" }}>{doc.nome}</h6>
              </div>
              <div style={{ fontSize: "14px", color: "#555" }}>
                <p><strong>Categoria:</strong> {doc.categoria}</p>
                <p><strong>Cliente:</strong> {doc.cliente}</p>
                <p><strong>Enviado por:</strong> {doc.enviado_por}</p>
                <p><strong>Data:</strong> {new Date(doc.data_upload || doc.data || doc.data_criacao).toLocaleDateString("pt-PT")}</p>
                <p><strong>Downloads:</strong> {doc.downloads || 0}</p>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button className="btn flex-grow-1" style={{ background: "#12C4EB", color: "white", borderRadius: "30px" }} onClick={() => baixarDocumento(doc)}>
                  <FaDownload className="me-2" /> Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {documentosPagina.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
          Nenhum documento encontrado.
        </div>
      )}

      {/* PAGINAÇÃO */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <p
          style={{
            color: "#8c8c8c",
            fontWeight: "500",
            margin: 0,
          }}
        >
          Mostrando {documentosPagina.length} de {documentosFiltrados.length} Documentos
        </p>

        <div className="d-flex gap-2">
          <button
            className="btn"
            style={{
              borderRadius: "25px",
              background: "#BFEFFF",
              padding: "10px 25px",
              border: "2px solid transparent",
              transition: "0.2s",
            }}
            onClick={() => mudarPagina(paginaAtualCorrigida - 1)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.border = "2px solid #12C4EB")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.border = "2px solid transparent")
            }
            disabled={paginaAtualCorrigida === 1}
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
              border: "none",
            }}
          >
            {paginaAtualCorrigida}
          </button>

          <button
            className="btn"
            style={{
              borderRadius: "25px",
              background: "#BFEFFF",
              padding: "10px 25px",
              border: "2px solid transparent",
              transition: "0.2s",
            }}
            onClick={() => mudarPagina(paginaAtualCorrigida + 1)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.border = "2px solid #12C4EB")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.border = "2px solid transparent")
            }
            disabled={paginaAtualCorrigida === totalPaginas}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
