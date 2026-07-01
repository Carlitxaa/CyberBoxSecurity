import "./Servicos.css";
import logo from "../../assets/logo.png";

import {
    FaClipboardCheck,
    FaShieldAlt,
    FaBuilding,
    FaExclamationTriangle,
    FaLock,
    FaGraduationCap
} from "react-icons/fa";

function NIS2() {
    const nis2 = [
        {
            icon: <FaShieldAlt />,
            titulo: "Gestão de Risco",
            pontos: [
                "Avaliação de riscos",
                "Políticas de segurança",
                "Gestão de incidentes",
            ],
        },
        {
            icon: <FaClipboardCheck />,
            titulo: "Conformidade NIS2",
            pontos: [
                "Gap Analysis",
                "Compliance NIS2",
                "Apoio documental",
            ],
        },
        {
            icon: <FaBuilding />,
            titulo: "Setores Abrangidos",
            pontos: [
                "Energia",
                "Transportes",
                "Saúde",
            ],
        },
        {
            icon: <FaExclamationTriangle />,
            titulo: "Sanções",
            pontos: [
                "Até 10 milhões €",
                "Auditorias obrigatórias",
                "Responsabilização",
            ],
        },
        {
            icon: <FaLock />,
            titulo: "Segurança Operacional",
            pontos: [
                "Controlo de acessos",
                "Monitorização",
                "Resposta a incidentes",
            ],
        },
        {
            icon: <FaGraduationCap />,
            titulo: "Formação e Awareness",
            pontos: [
                "Sensibilização",
                "Formação de equipas",
                "Simulações de phishing",
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
                    <h1>Diretiva Europeia NIS2</h1>

                    <p>
                        Conheça os requisitos da Diretiva NIS2 e prepare
                        a sua organização para os desafios da
                        cibersegurança e conformidade regulamentar.
                    </p>
                </div>
            </section>

            <section className="missao-section">
                <div className="missao-content">
                    <h2>O que é a NIS2?</h2>

                    <p>
                        A Diretiva NIS2 reforça os requisitos de
                        cibersegurança para organizações essenciais e
                        importantes da União Europeia.
                    </p>

                    <p>
                        O objetivo é aumentar a resiliência digital,
                        melhorar a gestão de riscos e garantir uma
                        resposta eficaz a incidentes de segurança.
                    </p>
                </div>
            </section>


            <section className="servicos-grid">
                {nis2.map((item, index) => (
                    <div className="servico-card" key={index}>

                        <div className="icon-circle">
                            {item.icon}
                        </div>

                        <h3>{item.titulo}</h3>

                        <p>
                            Requisitos e medidas fundamentais para cumprir
                            a Diretiva Europeia NIS2.
                        </p>

                        <ul>
                            {item.pontos.map((ponto, i) => (
                                <li key={i}>{ponto}</li>
                            ))}
                        </ul>

                    </div>
                ))}
            </section>

            <section className="cta">
                <h2>Prepare a sua organização para a NIS2</h2>

                <p>
                    Entre em contacto connosco para uma avaliação
                    inicial de conformidade.
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

export default NIS2;