/* eslint-disable no-unused-vars */
import React from "react";
import {
  Search,
  Package,
  Receipt,
  TrendingUp,
  AlertCircle,
  Calendar,
} from "lucide-react";

// Import Components
import Sidebar from "../../components/sidebar";
import StatCard from "../../components/StatCard";
import ProductCard from "../../components/ProductCard";

// Import Hook Logic
import { useDashboard } from "../../hooks/admin/useDashboard";

// Import Utils
import { rupiah, cn } from "../../utils/formatters";

// --- Component Internal: Status Pill ---
function StatusPill({ status }) {
  // Normalisasi status ke Uppercase agar match dengan key map
  const normalizedStatus = (status || "PENDING").toUpperCase();

  const map = {
    PAID: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    PENDING: "bg-amber-100 text-amber-700 border border-amber-200",
    CANCELLED: "bg-rose-100 text-rose-700 border border-rose-200",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide",
        map[normalizedStatus] ||
          "bg-slate-100 text-slate-700 border border-slate-200",
      )}
    >
      {normalizedStatus}
    </span>
  );
}

export default function DashboardPage() {
  // ✅ Panggil Logic dari Hook
  const {
    loadingProducts,
    errorProducts,
    transactions,
    query,
    filteredProducts,
    stats, // Didalamnya ada: totalProducts, totalStock, todayRevenue, dailyRevenue
    setQuery,
    addToCart,
  } = useDashboard();

  // Helper formatting tanggal lokal
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "-";
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <Sidebar active="dashboard" />

      {/* Main Content Wrapper */}
      {/* Margin left 64 (16rem) sesuai lebar Sidebar */}
      <div className="ml-64 min-h-screen transition-all duration-300">
        {/* --- Topbar --- */}
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md px-8 py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Dashboard
              </h1>
              <p className="text-sm font-medium text-slate-500">
                Halo Admin, berikut ringkasan toko hari ini.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full max-w-xs md:max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari produk..."
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* --- Content Area --- */}
        <main className="mx-auto max-w-7xl p-8 space-y-8">
          {/* 1. Stats Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Package}
              title="Total Produk"
              value={stats?.totalProducts ?? 0}
              subtitle="SKU Terdaftar"
            />
            <StatCard
              icon={TrendingUp}
              title="Total Stok"
              value={stats?.totalStock ?? 0}
              subtitle="Unit Tersedia"
            />
            <StatCard
              icon={Receipt}
              title="Transaksi Hari Ini"
              // Filter transaksi hari ini untuk menghitung jumlahnya
              value={
                transactions.filter((t) => {
                  if (!t.date) return false;
                  const tDate = new Date(t.date).toDateString();
                  const now = new Date().toDateString();
                  return tDate === now;
                }).length
              }
              subtitle="Pesanan Masuk"
            />

            {/* 🔥 CARD OMZET HARI INI 🔥 */}
            <StatCard
              icon={TrendingUp}
              title="Omzet Hari Ini"
              value={rupiah(stats?.todayRevenue ?? 0)} // Menggunakan stats dari hook
              subtitle="Pendapatan Kotor"
              className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-200 shadow-lg"
              iconClassName="text-blue-100 bg-white/20"
            />
          </div>

          {/* 2. Layout Grid: Produk (Kiri) & Transaksi (Kanan) */}
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[2fr_1fr]">
            {/* --- SECTION PRODUK --- */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Katalog Produk
                </h2>
                <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Total: {filteredProducts.length}
                </div>
              </div>

              {/* Loading State */}
              {loadingProducts && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-64 animate-pulse rounded-2xl bg-slate-200"
                    />
                  ))}
                </div>
              )}

              {/* Error State */}
              {errorProducts && (
                <div className="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 p-4 text-rose-600">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm font-medium">{errorProducts}</p>
                </div>
              )}

              {/* Empty State */}
              {!loadingProducts && filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-12">
                  <Package className="mb-2 h-10 w-10 text-slate-300" />
                  <p className="font-medium text-slate-500">
                    Produk tidak ditemukan
                  </p>
                </div>
              )}

              {/* Product Grid */}
              {!loadingProducts && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((p) => (
                    <ProductCard key={p.id} p={p} onAdd={addToCart} />
                  ))}
                </div>
              )}
            </div>

            {/* --- SECTION RIWAYAT TRANSAKSI --- */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-indigo-600" />
                  Riwayat Terbaru
                </h2>
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                  Lihat Semua
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="custom-scrollbar max-h-[600px] space-y-1 overflow-y-auto p-2">
                  {transactions.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-sm font-medium text-slate-500">
                        Belum ada transaksi
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Transaksi hari ini akan muncul disini
                      </p>
                    </div>
                  ) : (
                    transactions.map((t) => (
                      <div
                        key={t.id}
                        className="group flex cursor-default flex-col gap-2 rounded-xl border border-transparent p-3 transition-all hover:border-slate-200 hover:bg-slate-50"
                      >
                        {/* Row 1: ID & Status */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-white group-hover:shadow-sm">
                              <Receipt size={16} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">
                                #{t.id}
                              </p>
                              <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-slate-500">
                                <Calendar size={10} />
                                {formatDate(t.date)}
                              </p>
                            </div>
                          </div>
                          <StatusPill status={t.status} />
                        </div>

                        {/* Separator Dash */}
                        <div className="my-1 border-t border-dashed border-slate-100" />

                        {/* Row 2: Customer & Total */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex flex-col">
                            <span className="text-slate-400">Pelanggan</span>
                            <span className="max-w-[100px] truncate font-semibold text-slate-700">
                              {t.customer}
                            </span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-slate-400">
                              {t.items} Barang
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              {rupiah(t.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
