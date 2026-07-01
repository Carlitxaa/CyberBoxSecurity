import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import logo from "../../assets/logo.png";
import {
  FaShieldAlt,
  FaEye,
  FaUsers
} from "react-icons/fa";

function Home() {
  const [ultimasNoticias, setUltimasNoticias] = useState([]);

  useEffect(() => {
    const fetchUltimasNoticias = async () => {
      try {
        const response = await axios.get("http://localhost:5000/artigos");
        const publicados = response.data.filter(
          (artigo) => artigo.estado === "Publicado"
        );
        setUltimasNoticias(publicados.slice(0, 3));
      } catch (error) {
        console.error("Erro ao carregar últimas notícias:", error);
      }
    };

    fetchUltimasNoticias();
  }, []);

  const getImagemSrc = (artigo) => {
    if (artigo.imagem) {
      if (artigo.imagem.startsWith("http")) {
        return artigo.imagem;
      }
      return `http://localhost:5000${artigo.imagem}`;
    }
    return null;
  };

  return (
    <div className="home">

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

      <section className="hero">
        <div className="hero-content">
          <h1>
            Proteja o Seu Negócio
            <br />
            Mundo Digital
          </h1>

          <p>
            Soluções avançadas de cibersegurança para empresas que valorizam
            a proteção dos seus dados e sistemas.
          </p>

          <div className="hero-buttons">
            <button onClick={() => window.location.href = "/servicos"}>
              Conhecer Serviços
            </button>
            <button
              className="secondary"
              onClick={() => window.location.href = "/contactos"}
            >
              Contacte-nos
            </button>
          </div>
        </div>
      </section>

      <section className="why-us">
        <h2>Porque Escolher nos?</h2>

        <div className="why-cards">
          <div className="why-card">
            <div className="icon-circle">
              <FaShieldAlt />
            </div>

            <h3>Proteção Completa</h3>

            <p>
              Soluções integradas que protegem todos os aspetos da sua
              infraestrutura digital.
            </p>
          </div>

          <div className="why-card">
            <div className="icon-circle">
              <FaEye />
            </div>

            <h3>Monitorização 24/7</h3>

            <p>
              Soluções integradas que protegem todos os aspetos da sua
              infraestrutura digital.
            </p>
          </div>

          <div className="why-card">
            <div className="icon-circle">
              <FaUsers />
            </div>

            <h3>Equipa Especializada</h3>

            <p>
              Soluções integradas que protegem todos os aspetos da sua
              infraestrutura digital.
            </p>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stat-item">
          <h2>500</h2>
          <p>Clientes Protegidos</p>
        </div>

        <div className="stat-item">
          <h2>99.9%</h2>
          <p>Clientes Protegidos</p>
        </div>

        <div className="stat-item">
          <h2>24/7</h2>
          <p>Clientes Protegidos</p>
        </div>

        <div className="stat-item">
          <h2>15</h2>
          <p>Clientes Protegidos</p>
        </div>
      </section>

      <section className="nis2-section">
        <h2>Preparado para a NIS2?</h2>
        <p>
          Saiba como a diretiva afeta a sua organização e como pode preparar-se para cumprir.
        </p>
        <button onClick={() => window.location.href = "/nis2"}>
          Saber mais sobre NIS2
        </button>
      </section>

      <section className="latest-news">
        <h2>Últimas Notícias</h2>
        <p>
          Fique a par das novidades e artigos mais recentes sobre segurança digital.
        </p>

        <div className="news-cards">
          {ultimasNoticias.map((artigo) => (
            <div className="news-card" key={artigo.id}>
              {getImagemSrc(artigo) && (
                <img src={getImagemSrc(artigo)} alt={artigo.titulo} />
              )}
              <div className="news-card-body">
                <h3>{artigo.titulo}</h3>
                <p>{artigo.conteudo?.substring(0, 120)}...</p>
                <Link to={`/noticias/${artigo.id}`}>Ler mais →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

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

export default Home;