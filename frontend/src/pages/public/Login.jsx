import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { API_URL } from "../../config/api";
import logo from "../../assets/logo.png";
import { setCurrentUser } from "../../utils/auth";

function Login() {
  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const navigate = useNavigate();

  const handleLogin =
    async (e) => {
      e.preventDefault();

      try {
        const response =
          await axios.post(
            `${API_URL}/login`,
            {
              email,
              password,
            }
          );

        const { user, token } = response.data;

        setCurrentUser(user, token);

        if (user.tipo === "Administrador") {
          navigate("/admin/dashboard");
        } else if (user.tipo === "Gestor") {
          navigate("/gestor/dashboard");
        } else {
          navigate("/cliente/dashboard");
        }
      } catch (error) {
        const message =
          error?.response?.data?.error ||
          "Email ou password inválidos";
        alert(message);
      }
    };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{
        background:
          "linear-gradient(to right, #081226, #12324A)",
        position: "relative",
      }}
    >
      {/* ICON AND TITLE */}
      <div className="text-center mb-5">
        <img
          src={logo}
          alt="CyberBox"
          style={{
            height: "100px",
            marginBottom: "20px",
          }}
        />
        <h1
          style={{
            color: "#12C4EB",
            fontWeight: "700",
            fontSize: "28px",
            margin: 0,
          }}
        >
          Iniciar Sessao
        </h1>
      </div>

      {/* LOGIN CARD */}
      <div
        className="card p-4 shadow"
        style={{
          width: "400px",
          borderRadius: "20px",
          background: "white",
        }}
      >
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              className="form-control"
              placeholder="Digite o seu email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Password
            </label>

            <input
              type="password"
              className="form-control"
              placeholder="Digite a sua password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />
          </div>

          <button className="btn btn-info w-100 text-white">
            Entrar
          </button>
        </form>
      </div>

      {/* FOOTER LINKS */}
      <div
        className="d-flex justify-content-center align-items-center gap-3"
        style={{
          marginTop: "40px",
          color: "#12C4EB",
        }}
      >
        <FaArrowLeft />
        <a
          href="/"
          style={{
            color: "#12C4EB",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Voltar atras
        </a>
      </div>
    </div>
  );
}

export default Login;