import "./Servicos.css";
import logo from "../../assets/logo.png";
import {
  FaSearch,
  FaShieldAlt,
  FaBug,
  FaGraduationCap,
  FaUserShield,
  FaClipboardCheck
} from "react-icons/fa";

function Servicos() {
  const servicos = [
    {
      icon: <FaSearch />,
      titulo: "Avaliação de Maturidade",
      pontos: [
        "Análise da organização",
        "Identificação de riscos",
        "Plano de melhoria",
      ],
    },
    {
      icon: <FaClipboardCheck />,
      titulo: "Implementação NIS2",
      pontos: [
        "Gap Analysis",
        "Compliance NIS2",
        "Apoio documental",
      ],
    },
    {
      icon: <FaShieldAlt />,
      titulo: "Auditorias de Segurança",
      pontos: [
        "Auditorias técnicas",
        "Avaliação de controlos",
        "Relatórios executivos",
      ],
    },
    {
      icon: <FaBug />,
      titulo: "Testes de Vulnerabilidades",
      pontos: [
        "Scans automáticos",
        "Análise manual",
        "Recomendações",
      ],
    },
    {
      icon: <FaGraduationCap />,
      titulo: "Formação e Awareness",
      pontos: [
        "Formação de equipas",
        "Simulação de phishing",
        "Sensibilização",
      ],
    },
    {
      icon: <FaUserShield />,
      titulo: "Consultoria Especializada",
      pontos: [
        "Apoio contínuo",
        "Gestão de risco",
        "Estratégia de segurança",
      ],
    },
  ];

  return (
    <div className="servicos">

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
          <h1>Nossos Serviços</h1>

          <p>
            Conheça a CyberSecure e a nossa missão de proteger
            empresas do mundo digital.
          </p>
        </div>
      </section>

      <section className="servicos-grid">
        {servicos.map((servico, index) => (
          <div className="servico-card" key={index}>
            <div className="icon-circle">
              {servico.icon}
            </div>

            <h3>{servico.titulo}</h3>

            <p>
              Soluções integradas que protegem todos os aspetos
              da sua infraestrutura digital.
            </p>

            <ul>
              {servico.pontos.map((ponto, i) => (
                <li key={i}>{ponto}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="missao-section">
        <div className="missao-content">
          <h2>A Nossa Missão</h2>

          <p>
            Ajudar organizações a fortalecer a sua postura de
            cibersegurança através de serviços especializados,
            alinhados com boas práticas internacionais e
            requisitos regulamentares como a Diretiva NIS2.
          </p>

          <p>
            Trabalhamos lado a lado com os nossos clientes para
            identificar riscos, implementar medidas de proteção
            e promover uma cultura de segurança.
          </p>
        </div>
      </section>

      <section className="cta">
        <h2>Pronto para Proteger o Seu Negócio?</h2>

        <p>
          Entre em contacto connosco para uma avaliação gratuita.
        </p>

        <button onClick={() => window.location.href = "/contactos"}>
          Falar com um Especialista
        </button>
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

export default Servicos;