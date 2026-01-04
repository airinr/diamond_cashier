import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/admin/DashboardPage";
import ProductPage from "./pages/admin/ProductPage"; // Halaman Blank/Produk kamu

// Layout
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- PUBLIC ROUTES (Tanpa Sidebar) --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- ADMIN ROUTES (Pakai Sidebar) --- */}
        {/* Semua route di dalam sini otomatis punya Sidebar & Margin kiri */}
        <Route path="/admin" element={<MainLayout />}>
          
          {/* index artinya kalau buka /admin langsung ke dashboard */}
          <Route index element={<DashboardPage />} /> 
          
          {/* URL: /admin/products */}
          <Route path="products" element={<ProductPage />} /> 
          
          {/* Nanti tambah halaman lain di sini */}
          {/* <Route path="transactions" element={<TransactionPage />} /> */}
        </Route>

        {/* Redirect: Kalau URL ngawur, lempar ke Landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;