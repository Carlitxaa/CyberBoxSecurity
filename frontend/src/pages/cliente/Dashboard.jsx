import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFileAlt, FaExclamationTriangle, FaShieldAlt } from "react-icons/fa";
import { getCurrentUser } from "../../utils/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser] = useState(() => getCurrentUser());
  const [documentos, setDocumentos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [atividadeRecente, setAtividadeRecente] = useState([]);

  useEffect(() => {
    if (!currentUser || currentUser.tipo !== "Cliente") {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!currentUser) return;

    async function carregarDados() {
      try {
        const [docsRes, pedidosRes] = await Promise.all([
          axios.get("http://localhost:5000/documentos", {
            params: { cliente: currentUser.empresa },
          }),
          axios.get("http://localhost:5000/pedidos", {
            params: { cliente: currentUser.empresa },
          }),
        ]);

        setDocumentos(docsRes.data);
        setPedidos(pedidosRes.data);

        const atividade = [
          { titulo: "Documentos recebidos", descricao: `${docsRes.data.length} documentos disponíveis`, icon: "FaFileAlt", color: "#E3F2FD" },
          { titulo: "Pedidos pendentes", descricao: `${pedidosRes.data.filter(p => p.estado !== "Resolvido").length} aguardando`, icon: "FaExclamationTriangle", color: "#FFF3E0" },
        ];
        setAtividadeRecente(atividade);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    carregarDados();
  }, [currentUser]);

  const iconMap = {
    FaFileAlt: <FaFileAlt />,
    FaExclamationTriangle: <FaExclamationTriangle />,
    FaShieldAlt: <FaShieldAlt />,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F3F4", borderRadius: "40px", padding: "35px" }}>
      {/* HEADER */}
      <div className="mb-4">
        <h1 style={{ fontSize: "42px", fontWeight: "700", marginBottom: "0" }}>
          Dashboard
        </h1>
        <p style={{ color: "#777", fontSize: "18px", marginBottom: "30px" }}>
          Visão geral da sua conta
        </p>
      </div>

      {/* CARDS */}
      <div className="row g-4 mb-4">
        {[
          { title: "Documentos Disponíveis", value: documentos.length },
          { title: "Pedidos Totais", value: pedidos.length },
          { title: "Pedidos Pendentes", value: pedidos.filter(p => p.estado !== "Resolvido").length },
          { title: "Pedidos Resolvidos", value: pedidos.filter(p => p.estado === "Resolvido").length },
        ].map((card, index) => (
          <div className="col-lg-3" key={index}>
            <div style={{ background: "#DDF6FB", borderRadius: "30px", padding: "28px", border: "2px solid #12C4EB", textAlign: "center" }}>
              <h2 style={{ fontWeight: "700", fontSize: "42px", marginBottom: "10px" }}>{card.value}</h2>
              <p style={{ margin: 0, color: "#6B7280" }}>{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MEIO - 2 COLUNAS */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div style={{ background: "#DDF6FB", border: "2px solid #14C4E8", borderRadius: "30px", padding: "25px" }}>
            <h2 style={{ fontWeight: "700", fontSize: "20px", marginBottom: "20px" }}>Atividade Recente</h2>
            {atividadeRecente.map((item, index) => (
              <div key={index} style={{ background: "white", borderRadius: "20px", padding: "18px", marginBottom: "15px", display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{ width: "50px", height: "50px", background: item.color, borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                  {iconMap[item.icon]}
                </div>
                <div>
                  <h6 style={{ margin: 0, fontWeight: "600" }}>{item.titulo}</h6>
                  <small style={{ color: "#7d7d7d" }}>{item.descricao}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-6">
          <div style={{ background: "#DDF6FB", border: "2px solid #14C4E8", borderRadius: "30px", padding: "25px" }}>
            <h2 style={{ fontWeight: "700", fontSize: "20px", marginBottom: "20px" }}>Documentos Recentes</h2>
            {documentos.slice(-4).reverse().map((doc, index) => (
              <div key={index} style={{ background: "white", borderRadius: "20px", padding: "18px", marginBottom: "15px", display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#DDF6FB", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "#12C4EB" }}>
                  D
                </div>
                <div>
                  <h6 style={{ margin: 0, fontWeight: "600" }}>{doc.nome}</h6>
                  <small style={{ color: "#7d7d7d" }}>{doc.categoria}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
