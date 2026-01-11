import React from "react";
import { Gem, Lock, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ 1. Import Hook Routing

const LandingPage = () => {
  // ✅ 2. Inisialisasi Hook Navigate
  const navigate = useNavigate();

  return (
    // Container utama: Full layar, background hitam pekat, teks putih
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center font-sans text-slate-200 relative overflow-hidden">
      {/* --- ORNAMEN LATAR BELAKANG --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] bg-slate-800/20 rounded-full blur-[100px]"></div>
      </div>

      {/* --- KONTEN UTAMA --- */}
      <div className="relative z-10 text-center max-w-2xl px-6">
        {/* Ikon Diamond Besar */}
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-slate-900/50 rounded-full border border-slate-800 shadow-2xl">
            <Gem className="w-16 h-16 text-yellow-500" />
          </div>
        </div>

        {/* Judul & Subjudul */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Diamond<span className="text-yellow-500">POS</span> System
        </h1>
        <p className="text-lg text-slate-400 mb-10 leading-relaxed">
          Sistem kasir terintegrasi untuk manajemen toko perhiasan.
          <br className="hidden md:block" />
          Silakan masuk untuk memulai transaksi.
        </p>

        {/* --- AREA TOMBOL --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          {/* Tombol LOGIN (Utama - Kuning) */}
          <button
            onClick={() => navigate("/login")} // ✅ 3. Navigasi ke Login
            className="w-full sm:w-auto px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-lg transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(234,179,8,0.3)] flex items-center justify-center gap-2"
          >
            <UserCircle className="w-5 h-5" />
            Masuk Kasir
          </button>

          {/* Tombol REGISTER (Sekunder - Outline) */}
          <button
            onClick={() => navigate("/register")} // ✅ 4. Navigasi ke Register
            className="w-full sm:w-auto px-8 py-3 bg-transparent border border-slate-700 hover:border-yellow-500/50 hover:text-yellow-500 text-slate-300 font-medium rounded-lg transition-all flex items-center justify-center gap-2"
          >
            Registrasi
          </button>
        </div>

        {/* Footer Kecil / Status Keamanan */}
        <div className="mt-16 flex items-center justify-center gap-2 text-xs text-slate-600">
          <Lock className="w-3 h-3" />
          <span>Koneksi Aman & Terenkripsi</span>
          <span className="mx-2">•</span>
          <span>v1.0.0 Stable</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
