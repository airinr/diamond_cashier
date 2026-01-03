import React, { useState } from "react";
import { registerUser } from "../services/authService";
import {
  Gem,
  Mail,
  Lock,
  User,
  Loader2,
  ArrowLeft,
  AtSign,
} from "lucide-react";

const RegisterPage = ({ onBack, onLoginLink }) => {
  const [username, setUsername] = useState("");
  const [namaUser, setNamaUser] = useState("");
  const [password, setPassword] = useState("");

  const role = "admin"; // default role

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await registerUser({
        username,
        nama_user: namaUser,
        password,
        role,
      });

      setSuccess(true);

      // reset form
      setUsername("");
      setNamaUser("");
      setPassword("");
    } catch (error) {
      alert(error.message || "Gagal mendaftar");
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
          <p className="text-slate-400 mb-6">Akun admin berhasil dibuat.</p>
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
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 relative">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 text-slate-500 hover:text-yellow-500 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">Daftar Admin Toko</h2>
          <p className="text-slate-400 text-sm mt-1">
            Buat akun admin Diamond Kasir
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Username */}
          <div>
            <label className="text-sm text-slate-300">Username</label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4"
                placeholder="andika99"
              />
            </div>
          </div>

          {/* Nama User */}
          <div>
            <label className="text-sm text-slate-300">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={namaUser}
                onChange={(e) => setNamaUser(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4"
                placeholder="Andika Pratama"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4"
                placeholder="Password kuat"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 rounded-lg"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              "Buat Akun Admin"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun?{" "}
          <button
            onClick={onLoginLink}
            className="text-yellow-500 font-bold hover:underline"
          >
            Login di sini
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
