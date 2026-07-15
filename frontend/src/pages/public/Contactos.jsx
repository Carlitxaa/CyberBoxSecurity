import { useState } from "react";
import axios from "axios";
import "./Contactos.css";
import { API_URL } from "../../config/api";
import logo from "../../assets/logo.png";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Contactos() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    mensagem: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setStatusType("");

    const { nome, email, telefone, empresa, mensagem } = formData;

    if (!nome.trim() || !email.trim() || !mensagem.trim()) {
      setStatusType("error");
      setStatusMessage("Por favor, preencha pelo menos o nome, email e mensagem.");
      return;
    }

    try {
      await axios.post(`${API_URL}/pedidos/public`, {
        titulo: `Pedido de contacto: ${nome}`,
        categoria: "Contacto Geral",
        prioridade: "Média",
        estado: "Pendente",
        descricao: `Mensagem: ${mensagem}\nEmail: ${email}\nTelefone: ${telefone}\nEmpresa: ${empresa}`,
        cliente: nome,
        respostas: 0,
        historico_respostas: [],
      });

      setStatusType("success");
      setStatusMessage("Mensagem enviada com sucesso. Entraremos em contacto em breve.");
      setFormData({ nome: "", email: "", telefone: "", empresa: "", mensagem: "" });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setStatusType("error");
      setStatusMessage("Ocorreu um erro ao enviar a mensagem. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="contactos">
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
          <h1>Contactos</h1>

          <p>
            Conheça a CyberSecure e a nossa missão de proteger
            empresas do mundo digital.
          </p>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="contactos-content">

        {/* ESQUERDA */}
        <div className="contact-info">

          <h2>Informação de Contacto</h2>

          <p className="contact-text">
            Soluções integradas que protegem todos os aspetos
            da sua infraestrutura digital.
          </p>

          <div className="contact-item">
            <div className="icon-circle">
              <FaPhoneAlt />
            </div>

            <div>
              <h4>Telefone</h4>
              <p>+351 210 000 000</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="icon-circle">
              <FaEnvelope />
            </div>

            <div>
              <h4>Email</h4>
              <p>geral@cybersecure.pt</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="icon-circle">
              <FaMapMarkerAlt />
            </div>

            <div>
              <h4>Morada</h4>
              <p>Lisboa, Portugal</p>
            </div>
          </div>

        </div>

        {/* DIREITA */}
        <div className="contact-form">

          <h2>Envie-nos uma Mensagem</h2>

          <form onSubmit={handleSubmit}>
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              placeholder="O seu nome"
              value={formData.nome}
              onChange={handleChange}
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="O seu email"
              value={formData.email}
              onChange={handleChange}
            />

            <label>Telefone</label>
            <input
              type="text"
              name="telefone"
              placeholder="O seu telefone"
              value={formData.telefone}
              onChange={handleChange}
            />

            <label>Empresa</label>
            <input
              type="text"
              name="empresa"
              placeholder="Nome da empresa"
              value={formData.empresa}
              onChange={handleChange}
            />

            <label>Mensagem</label>
            <textarea
              name="mensagem"
              rows="4"
              placeholder="Escreva a sua mensagem"
              value={formData.mensagem}
              onChange={handleChange}
            ></textarea>

            <button type="submit">
              Enviar Mensagem
            </button>
          </form>

          {statusMessage && (
            <p className={`status-message ${statusType}`}>
              {statusMessage}
            </p>
          )}

        </div>

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

export default Contactos;
