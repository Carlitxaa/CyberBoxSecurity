import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Noticias.css";

import logo from "../../assets/logo.png";
import hero from "../../assets/hero.png";

function Noticias() {
  const [artigos, setArtigos] = useState([]);
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  const getImagemSrc = (artigo) => {
    if (artigo.imagem) {
      if (artigo.imagem.startsWith("http")) {
        return artigo.imagem;
      }
      return `http://localhost:5000${artigo.imagem}`;
    }
    return hero;
  };

  useEffect(() => {
    const fetchArtigos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/artigos");
        setArtigos(response.data);
      } catch (error) {
        console.error("Erro ao carregar artigos:", error);
      }
    };

    fetchArtigos();
  }, []);

  const artigosPublicados = artigos.filter(
    (artigo) => artigo.estado === "Publicado"
  );

  const [expandedIds, setExpandedIds] = useState({});

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubscribe = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setStatusType("");

    if (!email.trim()) {
      setStatusType("error");
      setStatusMessage("Por favor, insira um email válido.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/newsletter", {
        email: email.trim(),
      });

      if (response.status === 201) {
        setStatusType("success");
        setStatusMessage("Subscrição registada com sucesso.");
        setEmail("");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setStatusType("error");
        setStatusMessage("Este email já se encontra subscrito.");
      } else {
        setStatusType("error");
        setStatusMessage("Ocorreu um erro ao subscrever. Tente novamente.");
      }
      console.error("Erro ao subscrever newsletter:", error);
    }
  };

  return (
    <div className="noticias">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="CyberBox" />
        </div>

        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/servicos">Serviços</a>
          <a href="/nis2">NIS2</a>
          <a href="/sobre">Sobre</a>
          <a href="/noticias">Notícias</a>
          <a href="/contactos">Contactos</a>
          <a href="/login" className="login-link">
            Login
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>Artigos e Notícias</h1>

          <p>
            Acompanhe as últimas notícias, tendências e
            atualizações sobre cibersegurança.
          </p>
        </div>
      </section>

      {/* ARTIGOS */}
      <section className="noticias-grid">

        {artigosPublicados.map((artigo) => {
          const plain = stripHtml(artigo.conteudo);
          const preview = plain.substring(0, 150);
          const hasMore = plain.length > 150;
          const isExpanded = !!expandedIds[artigo.id];

          return (
            <div className="noticia-card" key={artigo.id}>

              <img src={getImagemSrc(artigo)} alt={artigo.titulo} className="noticia-img" />

              <div className="noticia-content">
                <h3>{artigo.titulo}</h3>

                <div className={`noticia-text ${isExpanded ? "expanded" : ""}`}>
                  {isExpanded ? (
                    <div dangerouslySetInnerHTML={{ __html: artigo.conteudo }} />
                  ) : (
                    <p>{preview}{hasMore ? "..." : ""}</p>
                  )}
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: 10 }}>
                  <Link to={`/noticias/${artigo.id}`} className="read-toggle">
                    Ler Detalhes →
                  </Link>
                  {hasMore && (
                    <button className="read-toggle" onClick={() => toggleExpand(artigo.id)}>
                      {isExpanded ? "Ler Menos" : "Ler Mais"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

      </section>

      {/* NEWSLETTER */}
      <section className="newsletter">

        <p>
          Receba novidades e conteúdos sobre cibersegurança.
        </p>

        <form className="newsletter-form" onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="O seu email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <button type="submit">
            Subscrever
          </button>
        </form>

        {statusMessage && (
          <p className={`status-message ${statusType}`}>
            {statusMessage}
          </p>
        )}

      </section>

      {/* FOOTER */}
      <footer className="footer">

        <div className="footer-content">

          <img src={logo} alt="CyberBox" />
          <p>
            Copyright © 2024 CyberSecure | All Rights Reserved
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Noticias;