/* eslint-disable no-unused-vars */
import React from "react";
import { Search, Package, Receipt, TrendingUp } from "lucide-react";

// Import Components
import Sidebar from "../../components/sidebar";
import StatCard from "../../components/StatCard";
import ProductCard from "../../components/ProductCard";

// Import Hook Logic
import { useDashboard } from "../../hooks/admin/useDashboard";

// Import Utils (Agar kode lebih bersih)
import { rupiah, cn } from "../../utils/formatters";

// Component Kecil Internal (Bisa dipindah ke folder components jika mau reusable)
function StatusPill({ status }) {
  const map = {
    PAID: "bg-emerald-100 text-emerald-700",
    PENDING: "bg-amber-100 text-amber-700",
    CANCELLED: "bg-rose-100 text-rose-700",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-1 text-xs font-semibold",
        map[status] || "bg-slate-100 text-slate-700"
      )}
    >
      {status}
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
    stats,
    setQuery,
    addToCart,
  } = useDashboard();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar Active State */}
      <Sidebar active="dashboard" />

      <div className="ml-52 min-h-screen">
        {/* --- Topbar --- */}
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Dashboard Kasir
              </h1>
              <p className="text-sm text-slate-500">
                Ringkasan produk & transaksi terbaru
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex w-full max-w-md items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari produk..."
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* --- Main Content --- */}
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6">
          {/* 1. Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Package}
              title="Total Produk"
              value={stats.totalProducts}
              subtitle="SKU terdaftar"
            />
            <StatCard
              icon={TrendingUp}
              title="Total Stok"
              value={stats.totalStock}
              subtitle="Item tersedia"
            />
            <StatCard
              icon={Receipt}
              title="Transaksi"
              value={transactions.length}
              subtitle="Riwayat transaksi"
            />
            <StatCard
              icon={TrendingUp}
              title="Omzet Hari Ini"
              value={rupiah(stats.todayRevenue)}
              subtitle="Total pendapatan"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            {/* 2. Products Section (Left Column) */}
            <div>
              <div className="mb-3 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Produk
                  </h2>
                  {loadingProducts && (
                    <p className="text-xs text-slate-500 animate-pulse">
                      Memuat data...
                    </p>
                  )}
                  {errorProducts && (
                    <p className="text-xs text-rose-500">{errorProducts}</p>
                  )}
                </div>
                <div className="text-sm text-slate-500">
                  Total:{" "}
                  <span className="font-semibold text-slate-900">
                    {filteredProducts.length}
                  </span>
                </div>
              </div>

              {/* Grid Produk */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                {filteredProducts.length === 0 && !loadingProducts ? (
                  <div className="col-span-full py-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    Produk tidak ditemukan.
                  </div>
                ) : (
                  filteredProducts.map((p) => (
                    <ProductCard key={p.id} p={p} onAdd={addToCart} />
                  ))
                )}
              </div>
            </div>

            {/* 3. Transactions Section (Right Column) */}
            <div className="grid gap-6 h-fit">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-slate-900">
                    Transaksi Terbaru
                  </h3>
                </div>

                <div className="space-y-3">
                  {transactions.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">
                      Belum ada transaksi hari ini.
                    </p>
                  ) : (
                    transactions.map((t) => (
                      <div
                        key={t.id}
                        className="rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
                      >
                        <div className="flex justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {t.id}
                            </p>
                            <p className="text-xs text-slate-500">
                              {t.date} • {t.method}
                            </p>
                          </div>
                          <div className="text-right">
                            <StatusPill status={t.status} />
                            <p className="mt-1 text-sm font-bold text-slate-900">
                              {rupiah(t.total)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
