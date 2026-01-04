import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Sesuaikan path sidebar kamu

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Logic simpel untuk tentukan menu mana yang kuning (active)
  // Misal url "/admin/products" -> active key "product"
  const getActiveKey = (path) => {
    if (path.includes("products")) return "product";
    if (path.includes("transactions")) return "transaction";
    if (path.includes("users")) return "user";
    return "dashboard";
  };

  const handleLogout = () => {
    // Hapus token/session disini nanti
    navigate("/login"); 
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar dipasang di sini, sekali untuk semua halaman admin */}
      <Sidebar 
        active={getActiveKey(location.pathname)} 
        onLogout={handleLogout}
      />

      {/* Konten Halaman (Dashboard/Produk) akan muncul di sini */}
      <div className="ml-64 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;