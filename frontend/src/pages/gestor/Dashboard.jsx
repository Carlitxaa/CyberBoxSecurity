import {
  FaFileAlt,
  FaUserPlus,
  FaExclamationTriangle,
  FaShieldAlt,
} from "react-icons/fa";

import {
  useState,
  useEffect,
} from "react";

import axios from "axios";

export default function Dashboard() {
  const [
    utilizadores,
    setUtilizadores,
  ] = useState([]);
  const [
    atividadeRecente,
    setAtividadeRecente,
  ] = useState([]);
  const [
    estadoSistema,
    setEstadoSistema,
  ] = useState({
    pedidosPendentes: 0,
    documentosAtivos: 0,
    utilizadoresAtivos: 0,
    sistema: "Online",
  });

  useEffect(() => {
    async function buscarUtilizadores() {
      try {
        const response =
          await axios.get(
            "http://localhost:5000/utilizadores"
          );

        setUtilizadores(
          response.data
        );
      } catch (error) {
        console.error(
          "Erro ao buscar utilizadores:",
          error
        );
      }
    }

    buscarUtilizadores();
  }, []);

  useEffect(() => {
    async function buscarAtividadeRecente() {
      try {
        const response =
          await axios.get(
            "http://localhost:5000/dashboard/atividade-recente"
          );

        setAtividadeRecente(
          response.data
        );
      } catch (error) {
        console.error(
          "Erro ao buscar atividade recente:",
          error
        );
      }
    }

    buscarAtividadeRecente();
  }, []);

  useEffect(() => {
    async function buscarEstadoSistema() {
      try {
        const response =
          await axios.get(
            "http://localhost:5000/dashboard/estado-sistema"
          );

        setEstadoSistema(
          response.data
        );
      } catch (error) {
        console.error(
          "Erro ao buscar estado do sistema:",
          error
        );
      }
    }

    buscarEstadoSistema();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F3F4",
        borderRadius: "40px",
        padding: "35px",
      }}
    >
      {/* HEADER */}
      <div className="mb-4">
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "700",
            marginBottom: "0",
          }}
        >
          Dashboard do Gestor
        </h1>

        <p
          style={{
            color: "#777",
            fontSize: "18px",
            marginBottom: "30px",
          }}
        >
          Visão geral do sistema
        </p>
      </div>

      {/* CARDS */}
      <div className="row g-4 mb-4">
        {[
          {
            title:
              "Utilizadores Totais",
            value:
              utilizadores.length,
          },
          {
            title:
              "Administradores",
            value:
              utilizadores.filter(
                (u) =>
                  u.tipo ===
                  "Administrador"
              ).length,
          },
          {
            title:
              "Clientes",
            value:
              utilizadores.filter(
                (u) =>
                  u.tipo ===
                  "Cliente"
              ).length,
          },
          {
            title:
              "Gestores + Colaboradores",
            value:
              utilizadores.filter(
                (u) =>
                  u.tipo ===
                  "Gestor" ||
                  u.tipo ===
                  "Colaborador"
              ).length,
          },
        ].map(
          (card, index) => (
            <div
              className="col-lg-3"
              key={index}
            >
              <div
                style={{
                  background:
                    "#DDF6FB",
                  borderRadius:
                    "30px",
                  padding:
                    "28px",
                  border:
                    "2px solid #12C4EB",
                  textAlign:
                    "center",
                }}
              >
                <h2
                  style={{
                    fontWeight:
                      "700",
                    fontSize:
                      "42px",
                    marginBottom:
                      "10px",
                  }}
                >
                  {card.value}
                </h2>

                <p
                  style={{
                    margin: 0,
                    color:
                      "#6B7280",
                  }}
                >
                  {card.title}
                </p>
              </div>
            </div>
          )
        )}
      </div>

      {/* MEIO */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div
            style={{
              background:
                "#DDF6FB",
              border:
                "2px solid #14C4E8",
              borderRadius:
                "30px",
              padding:
                "25px",
            }}
          >
            <h2
              style={{
                fontWeight:
                  "700",
                fontSize:
                  "20px",
                marginBottom:
                  "20px",
              }}
            >
              Atividade Recente
            </h2>
            {atividadeRecente.map(
              (
                item,
                index
              ) => {
                const iconMap = {
                  FaUserPlus: <FaUserPlus />,
                  FaFileAlt: <FaFileAlt />,
                  FaExclamationTriangle: <FaExclamationTriangle />,
                  FaShieldAlt: <FaShieldAlt />,
                };
                return (
                <div
                  key={index}
                  style={{
                    background:
                      "white",
                    borderRadius:
                      "20px",
                    padding:
                      "18px",
                    marginBottom:
                      "15px",
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: "15px",
                  }}
                >
                  <div
                    style={{
                      width:
                        "50px",
                      height:
                        "50px",
                      background:
                        item.color,
                      borderRadius:
                        "18px",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      fontSize:
                        "18px",
                    }}
                  >
                    {iconMap[item.icon]}
                  </div>

                  <div>
                    <h6
                      style={{
                        margin: 0,
                        fontWeight:
                          "600",
                      }}
                    >
                      {item.titulo}
                    </h6>

                    <small
                      style={{
                        color:
                          "#7d7d7d",
                      }}
                    >
                      {item.descricao}
                    </small>
                  </div>
                </div>
                );
              }
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div
            style={{
              background:
                "#DDF6FB",
              border:
                "2px solid #14C4E8",
              borderRadius:
                "30px",
              padding:
                "25px",
            }}
          >
            <h2
              style={{
                fontWeight:
                  "700",
                fontSize:
                  "20px",
                marginBottom:
                  "20px",
              }}
            >
              Últimos Utilizadores
            </h2>

            {utilizadores
    .slice(-4)
                  .reverse()
                  .map(
                    (
                      user,
                      index
                    ) => (
                      <div
                        key={index}
                        style={{
                          background:
                            "white",
                          borderRadius:
                            "20px",
                          padding:
                            "18px",
                          marginBottom:
                            "15px",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: "15px",
                        }}
                      >
                        <div
                          style={{
                            width:
                              "50px",
                            height:
                              "50px",
                            borderRadius:
                              "50%",
                            background:
                              "#DDF6FB",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            fontWeight:
                              "700",
                            color:
                              "#12C4EB",
                          }}
                        >
                          {
                            user.nome?.charAt(
                              0
                            )
                          }
                        </div>

                        <div>
                          <h6
                            style={{
                              margin: 0,
                              fontWeight:
                                "600",
                            }}
                          >
                            {
                              user.nome
                            }
                          </h6>

                          <small
                            style={{
                              color:
                                "#7d7d7d",
                            }}
                          >
                            {
                              user.email
                            }
                          </small>
                        </div>
                      </div>
                    )
                  )
              }
                
          </div>
        </div>
      </div>
      {/* ESTADO DO SISTEMA */}
      <div className="mt-4">
        <div
          style={{
            background:
              "#DDF6FB",
            border:
              "2px solid #12C4EB",
            borderRadius:
              "30px",
            padding:
              "28px",
          }}
        >
          <h2
            style={{
              fontWeight:
                "700",
              fontSize:
                "24px",
              marginBottom:
                "25px",
            }}
          >
            Estado do Sistema
          </h2>

          <div className="row">
            {[
              {
                title:
                  "Pedidos Pendentes",
                value:
                  estadoSistema.pedidosPendentes,
              },
              {
                title:
                  "Documentos Ativos",
                value:
                  estadoSistema.documentosAtivos,
              },
              {
                title:
                  "Utilizadores Ativos",
                value:
                  estadoSistema.utilizadoresAtivos,
              },
            ].map(
              (
                item,
                index
              ) => (
                <div
                  className="col-lg-4"
                  key={index}
                >
                  <p
                    style={{
                      marginBottom:
                        "10px",
                      color:
                        "#7d7d7d",
                      fontWeight:
                        "500",
                    }}
                  >
                    {item.title}
                  </p>

                  <h3
                    style={{
                      margin: "10px 0",
                      color:
                        "#12C4EB",
                      fontWeight:
                        "700",
                      fontSize:
                        "28px",
                    }}
                  >
                    {item.value}
                  </h3>

                  <small
                    style={{
                      color:
                        "#7d7d7d",
                    }}
                  >
                    {estadoSistema.sistema}
                  </small>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}