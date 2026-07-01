
import "./Sobre.css";
import logo from "../../assets/logo.png";
import {
  FaBullseye,
  FaEye,
  FaHeart,
  FaUserCircle
} from "react-icons/fa";

function Sobre() {
  return (
    <div className="sobre">

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
          <h1>Sobre Nós</h1>

          <p>
            Conheça a CyberSecure e a nossa missão de proteger
            empresas do mundo digital.
          </p>
        </div>
      </section>

      {/* MISSAO VISAO VALORES */}
      <section className="cards-section">

        <div className="info-card">
          <div className="icon-circle">
            <FaBullseye />
          </div>

          <h3>Missão</h3>

          <p>
            Proteger organizações através de soluções modernas
            de cibersegurança.
          </p>
        </div>

        <div className="info-card">
          <div className="icon-circle">
            <FaEye />
          </div>

          <h3>Visão</h3>

          <p>
            Ser uma referência nacional na área da
            cibersegurança empresarial.
          </p>
        </div>

        <div className="info-card">
          <div className="icon-circle">
            <FaHeart />
          </div>

          <h3>Valores</h3>

          <p>
            Confiança, inovação, responsabilidade e
            compromisso com os clientes.
          </p>
        </div>

      </section>

      {/* MISSAO */}
      <section className="missao-section">
        <div className="missao-content">
          <h2>A Nossa Missão</h2>

          <p>
            A CyberSecure apoia organizações públicas e privadas
            na proteção dos seus sistemas, infraestruturas e
            dados críticos.
          </p>

          <p>
            Através de auditorias, consultoria especializada,
            implementação de requisitos da diretiva NIS2 e
            programas de formação, ajudamos os nossos clientes
            a reduzir riscos e aumentar a sua maturidade de
            cibersegurança.
          </p>

          <p>
            Trabalhamos segundo boas práticas internacionais
            reconhecidas para garantir soluções eficazes e
            sustentáveis.
          </p>
        </div>
      </section>

      {/* EQUIPA */}
      <section className="equipa-section">

        <h2>A Nossa Equipa</h2>

        <div className="equipa-grid">

          {[1,2,3,4].map((membro) => (
            <div className="membro-card" key={membro}>
              <FaUserCircle className="avatar" />

              <h4>Joana Silva</h4>

              <p>CEO & Fundador</p>
            </div>
          ))}

        </div>

      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <img src={logo} alt="CyberBox" />

          <p>
            Copyright © 2023 BRK Templates |
            All Rights Reserved
          </p>
        </div>
      </footer>

    </div>
  );
}

export default Sobre;

