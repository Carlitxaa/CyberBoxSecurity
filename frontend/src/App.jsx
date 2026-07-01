import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import GestorLayout from "./layouts/GestorLayout";
import ClienteLayout from "./layouts/ClienteLayout";

// Public
import Home from "./pages/public/Home";
import Sobre from "./pages/public/Sobre";
import Servicos from "./pages/public/Servicos";
import NIS2 from "./pages/public/NIS2";
import Noticias from "./pages/public/Noticias";
import Contactos from "./pages/public/Contactos";
import Login from "./pages/public/Login";
import Noticia from "./pages/public/Noticia";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminArtigos from "./pages/admin/Artigos";
import AdminUtilizadores from "./pages/admin/Utilizadores";
import AdminDocumentos from "./pages/admin/Documentos";
import AdminPedidos from "./pages/admin/Pedidos";

// Gestor
import GestorDashboard from "./pages/gestor/Dashboard";
import GestorArtigos from "./pages/gestor/Artigos";
import GestorUtilizadores from "./pages/gestor/Utilizadores";
import GestorDocumentos from "./pages/gestor/Documentos";
import GestorPedidos from "./pages/gestor/Pedidos";

// Cliente
import ClienteDashboard from "./pages/cliente/Dashboard";
import ClienteDocumentos from "./pages/cliente/Documentos";
import ClientePedidos from "./pages/cliente/Pedidos";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/nis2" element={<NIS2 />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/noticias/:id" element={<Noticia />} />
        <Route path="/contactos" element={<Contactos />} />
        <Route path="/login" element={<Login />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="artigos" element={<AdminArtigos />} />
          <Route path="utilizadores" element={<AdminUtilizadores />} />
          <Route path="documentos" element={<AdminDocumentos />} />
          <Route path="pedidos" element={<AdminPedidos />} />
        </Route>

        {/* GESTOR */}
        <Route path="/gestor" element={<GestorLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<GestorDashboard />} />
          <Route path="artigos" element={<GestorArtigos />} />
          <Route path="utilizadores" element={<GestorUtilizadores />} />
          <Route path="documentos" element={<GestorDocumentos />} />
          <Route path="pedidos" element={<GestorPedidos />} />
        </Route>

        {/* CLIENTE */}
        <Route path="/cliente" element={<ClienteLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ClienteDashboard />} />
          <Route path="documentos" element={<ClienteDocumentos />} />
          <Route path="pedidos" element={<ClientePedidos />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;