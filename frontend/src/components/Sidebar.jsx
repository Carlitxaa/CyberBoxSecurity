import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { clearCurrentUser } from "../utils/auth";

import {
  BsGrid,
  BsFileText,
  BsPeople,
  BsFolder,
  BsTicketPerforated,
  BsBoxArrowRight,
} from "react-icons/bs";

function Sidebar({ role }) {
  const location = useLocation();

  const roleLower = role.toLowerCase();

  const menuItems = [
    {
      name: "Dashboard",
      path: `/${roleLower}/dashboard`,
      icon: <BsGrid />,
    },
  ];

  if (role === "Admin" || role === "Gestor") {
    menuItems.push(
      {
        name: "Artigos",
        path: `/${roleLower}/artigos`,
        icon: <BsFileText />,
      },
      {
        name: "Utilizadores",
        path: `/${roleLower}/utilizadores`,
        icon: <BsPeople />,
      }
    );
  }

  menuItems.push(
    {
      name: "Documentos",
      path: `/${roleLower}/documentos`,
      icon: <BsFolder />,
    },
    {
      name: "Pedidos",
      path: `/${roleLower}/pedidos`,
      icon: <BsTicketPerforated />,
    }
  );

  return (
    <div
      style={{
        width: "270px",
        backgroundColor: "#081226",
        minHeight: "100vh",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* HEADER LOGO */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "35px",
          marginTop: "10px",
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "58px",
            height: "58px",
            objectFit: "contain",
          }}
        />

        <h4
          style={{
            color: "white",
            margin: 0,
            fontWeight: "700",
            fontSize: "24px",
          }}
        >
          {role === "Cliente" ? "Área Cliente" : role}
        </h4>
      </div>

      {/* MENU */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              style={{
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "18px 22px",
                  borderRadius: "22px",
                  backgroundColor: isActive
                    ? "#12C7EA"
                    : "transparent",
                  border: "1.5px solid #12C7EA",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "18px",
                  transition: "0.2s",
                }}
              >
                <span
                  style={{
                    fontSize: "22px",
                  }}
                >
                  {item.icon}
                </span>

                {item.name}
              </div>
            </Link>
          );
        })}
      </div>

      {/* FOOTER */}
      <div
        style={{
          marginTop: "auto",
        }}
      >
        <Link
          to="/login"
          onClick={clearCurrentUser}
          style={{
            textDecoration: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              padding: "18px 22px",
              borderRadius: "22px",
              border: "1.5px solid #12C7EA",
              color: "white",
              fontWeight: "600",
              fontSize: "18px",
            }}
          >
            <BsBoxArrowRight
              style={{
                fontSize: "22px",
              }}
            />

            Sair
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;