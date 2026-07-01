import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Noticias.css";

import logo from "../../assets/logo.png";

export default function Noticia() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artigo, setArtigo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtigo = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/artigos/${id}`);
        setArtigo(res.data);
      } catch (err) {
        setError("Artigo não encontrado ou não publicado.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtigo();
  }, [id]);

  const getImagemSrc = (artigo) => {
    if (!artigo) return null;
    if (artigo.imagem) {
      if (artigo.imagem.startsWith("http")) return artigo.imagem;
      return `http://localhost:5000${artigo.imagem}`;
    }
    return null;
  };

  const formatDate = (artigo) => {
    const dateFields = ["data_criacao", "data", "created_at", "data_publicacao"];
    for (const f of dateFields) {
      if (artigo[f]) {
        try {
          return new Date(artigo[f]).toLocaleDateString("pt-PT");
        } catch (e) {}
      }
    }
    return "";
  };

  if (loading) return <div style={{ padding: 40 }}>A carregar...</div>;
  if (error) return (
    <div style={{ padding: 40 }}>
      <p>{error}</p>
      <button className="btn btn-light" onClick={() => navigate(-1)}>Voltar às Notícias</button>
    </div>
  );

  return (
    <div className="noticias" style={{ paddingBottom: 60 }}>
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="CyberBox" />
        </div>
      </nav>

      <section className="hero" style={{ paddingBottom: 30 }}>
        <div className="hero-content">
          <h1>{artigo.titulo}</h1>
          <p style={{ color: "#777", marginTop: 8 }}>
            {artigo.autor && <span>Por {artigo.autor} • </span>}
            {artigo.categoria && <span>{artigo.categoria} • </span>}
            {formatDate(artigo)}
          </p>
        </div>
      </section>

      <main style={{ maxWidth: 900, margin: "0 auto" }}>
        {getImagemSrc(artigo) && (
          <img src={getImagemSrc(artigo)} alt={artigo.titulo} style={{ width: "100%", borderRadius: 12, marginBottom: 18 }} />
        )}

        <article style={{ background: "white", padding: 28, borderRadius: 14, lineHeight: 1.7 }}>
          <div dangerouslySetInnerHTML={{ __html: artigo.conteudo }} />
        </article>

        <div style={{ marginTop: 20 }}>
          <Link to="/noticias" className="btn btn-light">Voltar às Notícias</Link>
        </div>
      </main>
    </div>
  );
}
