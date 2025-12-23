import React, { useState } from "react";
import { registerUser } from "../services/authService";
import { Gem, Mail, Lock, User, Loader2, ArrowLeft } from "lucide-react";

const RegisterPage = ({ onBack, onLoginLink }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await registerUser(name, email, password);
      setSuccess(true);
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      alert("Gagal mendaftar", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-green-500/30 p-8 rounded-2xl text-center shadow-2xl">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gem className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Registrasi Berhasil!
          </h2>
          <p className="text-slate-400 mb-6">
            Akun toko Anda telah siap digunakan.
          </p>
          <button
            onClick={onLoginLink}
            className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition w-full"
          >
            Lanjut ke Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 relative">
        {/* Tombol Kembali ke Landing Page */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 text-slate-500 hover:text-yellow-500 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Daftar Toko Baru</h2>
          <p className="text-slate-400 text-sm mt-1">
            Lengkapi data untuk membuat akun kasir
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Input Nama */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Manager Diamond"
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition placeholder-slate-600"
                required
              />
            </div>
          </div>

          {/* Input Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="toko@diamond.com"
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition placeholder-slate-600"
                required
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Buat password kuat"
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition placeholder-slate-600"
                required
              />
            </div>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-100 hover:bg-white text-slate-900 font-bold py-3 rounded-lg transition mt-4 flex items-center justify-center disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Buat Akun Sekarang"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun?{" "}
          <button
            onClick={onLoginLink}
            className="text-yellow-500 font-bold hover:underline"
          >
            Login disini
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
