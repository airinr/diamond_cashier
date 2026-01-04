import React, { useState } from "react";
import { Search } from "lucide-react";

export default function ProductPage() {
  // State untuk search bar di topbar (jika diperlukan)
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-slate-50">
        {/* --- TOPBAR START --- */}
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Judul Halaman
              </h1>
              <p className="text-sm text-slate-500">
                Deskripsi singkat halaman ini
              </p>
            </div>

            <div className="flex w-full max-w-md items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari sesuatu..."
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
        {/* --- TOPBAR END --- */}

        {/* --- CONTENT AREA START --- */}
        <div className="mx-auto max-w-6xl px-4 py-6">
          
          {/* Area Konten Kosong. 
            Silakan mulai coding komponen barumu di sini.
          */}
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-100 p-10 text-center">
            <p className="text-slate-500">Konten halaman dimulai di sini...</p>
          </div>

        </div>
        {/* --- CONTENT AREA END --- */}

      </div>
  );
}