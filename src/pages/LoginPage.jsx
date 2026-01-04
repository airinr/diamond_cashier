import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 1. Import ini
import { Gem, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { useAuthLogin } from "../hooks/useAuthLogin";

const LoginPage = () => {
  // ✅ 2. Hapus props onBack/onLoginSuccess, ganti dengan hook ini
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading, errorMessage } = useAuthLogin();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Login logic
      await login(username, password);
      
      // ✅ 3. Jika sukses, pindah ke Dashboard Admin
      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);
      // Error handling sudah diurus oleh hook (errorMessage)
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 relative">
        <button
          // ✅ 4. Tombol back kembali ke Landing Page ("/")
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 text-slate-500 hover:text-yellow-500 transition"
          type="button"
          disabled={isLoading}
          aria-label="Kembali"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-slate-950 rounded-full border border-slate-800 mb-4 shadow-lg">
            <Gem className="w-10 h-10 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Login Kasir</h2>
          <p className="text-slate-400 text-sm mt-1">
            Masuk untuk memulai shift Anda
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@diamond.com"
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition placeholder-slate-600 disabled:opacity-70"
                required
                disabled={isLoading}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition placeholder-slate-600 disabled:opacity-70"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-3 rounded-lg transition shadow-lg shadow-yellow-500/20 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Memproses...
              </>
            ) : (
              "Masuk Sekarang"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Lupa password?{" "}
          <span className="text-yellow-500 cursor-pointer hover:underline">
            Hubungi Manager
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;