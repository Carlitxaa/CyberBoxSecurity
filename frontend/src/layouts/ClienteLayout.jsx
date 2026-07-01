import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getCurrentUser, clearCurrentUser } from "../utils/auth";

function ClienteLayout() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.tipo !== "Cliente") {
      clearCurrentUser();
      navigate("/login", { replace: true });
      return;
    }

    setAuthorized(true);
  }, [navigate]);

  if (!authorized) {
    return <div style={{ minHeight: "100vh", padding: 24 }}>A carregar...</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#1C2B3F",
      }}
    >
      <Sidebar role="Cliente" />
      <div
        style={{
          flex: 1,
          overflowX: "auto",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default ClienteLayout;
