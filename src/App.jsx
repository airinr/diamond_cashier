import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/admin/DashboardPage";
import ProductPage from "./pages/admin/ProductPage";
import TransactionPage from "./pages/admin/TransactionPage";

function App() {
  return (
    // 1. Bungkus aplikasi dengan BrowserRouter
    <BrowserRouter>
      <Routes>
        {/* 2. Tentukan URL dan Halaman tujuannya */}
        {/* Halaman Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Halaman Admin */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/transactions" element={<TransactionPage />} />
        {/* Tambahkan route lain nanti di sini (transaksi, user, dll) */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
