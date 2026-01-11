/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Plus, Pencil, Trash2, X, Search, Package, Layers } from "lucide-react";
import Sidebar from "../../components/sidebar";
import { useProducts } from "../../hooks/admin/useProduct"; // Hook Produk Lama
import { useCategories } from "../../hooks/admin/useCategories"; // ✅ Hook Kategori Baru
import { rupiah, cn } from "../../utils/formatters";

export default function ProductsPage() {
  // State untuk Tab Aktif ('products' | 'categories')
  const [activeTab, setActiveTab] = useState("products");

  // --- Logic Produk ---
  const productLogic = useProducts();

  // --- Logic Kategori ---
  const categoryLogic = useCategories();

  // Helper untuk switch content
  const isProd = activeTab === "products";

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar active="products" />

      <div className="ml-52 min-h-screen">
        {/* Topbar */}
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Manajemen Gudang
              </h1>
              <p className="text-sm text-slate-500">
                Kelola {isProd ? "daftar produk & stok" : "kategori barang"}
              </p>
            </div>

            {/* Action Button Dinamis */}
            <button
              onClick={
                isProd ? productLogic.openAddModal : categoryLogic.openAddModal
              }
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:scale-95 transition"
            >
              <Plus size={16} />
              {isProd ? "Tambah Produk" : "Tambah Kategori"}
            </button>
          </div>

          {/* --- TAB NAVIGATION --- */}
          <div className="mx-auto max-w-6xl px-4 mt-2">
            <div className="flex gap-6 border-b border-slate-200">
              <button
                onClick={() => setActiveTab("products")}
                className={cn(
                  "pb-3 text-sm font-semibold transition border-b-2",
                  activeTab === "products"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                )}
              >
                Data Produk
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={cn(
                  "pb-3 text-sm font-semibold transition border-b-2",
                  activeTab === "categories"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                )}
              >
                Kategori Barang
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-w-7xl mx-auto">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Table Header & Search */}
            <div className="border-b border-slate-100 px-6 py-4 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">
                {isProd
                  ? `Daftar Produk (${productLogic.products.length})`
                  : `Daftar Kategori (${categoryLogic.categories.length})`}
              </h3>
              {/* Search Placeholder (Logic search bisa ditambahkan nanti ke masing-masing hook) */}
              <div
                className="relative w-64 opacity-50 cursor-not-allowed"
                title="Fitur pencarian coming soon"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  disabled
                  className="w-full rounded-lg border border-slate-200 pl-9 pr-4 py-2 text-sm bg-slate-50"
                  placeholder="Cari..."
                />
              </div>
            </div>

            {/* --- TABLE CONTENT SWITCHER --- */}
            <div className="overflow-x-auto">
              {isProd ? (
                // --- TABEL PRODUK ---
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Nama Produk</th>
                      <th className="px-6 py-4">Kategori</th>
                      <th className="px-6 py-4">Harga</th>
                      <th className="px-6 py-4 text-center">Stok</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {productLogic.products.map((item) => (
                      <tr
                        key={item.id_produk}
                        className="hover:bg-slate-50 transition"
                      >
                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                            <Package size={20} />
                          </div>
                          {item.nama_produk}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
                            {item.kode_kategori}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700">
                          {rupiah(item.harga)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={cn(
                              "font-medium",
                              item.stok < 5
                                ? "text-rose-600"
                                : "text-emerald-600"
                            )}
                          >
                            {item.stok}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => productLogic.openEditModal(item)}
                              className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() =>
                                productLogic.handleDelete(item.id_produk)
                              }
                              className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                // --- TABEL KATEGORI ---
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Kode Kategori</th>
                      <th className="px-6 py-4">Nama Kategori</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categoryLogic.loading ? (
                      <tr>
                        <td colSpan="3" className="p-6 text-center">
                          Memuat kategori...
                        </td>
                      </tr>
                    ) : (
                      categoryLogic.categories.map((cat) => (
                        <tr
                          key={cat.kode_kategori}
                          className="hover:bg-slate-50 transition"
                        >
                          <td className="px-6 py-4 font-mono font-semibold text-slate-700">
                            {cat.kode_kategori}
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-yellow-100 flex items-center justify-center text-yellow-600">
                              <Layers size={16} />
                            </div>
                            {cat.nama_kategori}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => categoryLogic.openEditModal(cat)}
                                className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  categoryLogic.handleDelete(cat.kode_kategori)
                                }
                                className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL PRODUK --- */}
      {/* --- MODAL PRODUK --- */}
      {productLogic.isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                {productLogic.isEditMode ? "Edit Produk" : "Tambah Produk Baru"}
              </h2>
              <button
                onClick={productLogic.closeModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={productLogic.handleSave} className="space-y-4">
              {/* 1. Nama Produk */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nama Produk
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Contoh: Cincin Emas 24 Karat"
                  value={productLogic.formData.nama_produk}
                  onChange={(e) =>
                    productLogic.setFormData({
                      ...productLogic.formData,
                      nama_produk: e.target.value,
                    })
                  }
                />
              </div>

              {/* 2. Kategori (Dropdown ambil dari categoryLogic) */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Kategori
                </label>
                <select
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
                  value={productLogic.formData.kode_kategori}
                  onChange={(e) =>
                    productLogic.setFormData({
                      ...productLogic.formData,
                      kode_kategori: e.target.value,
                    })
                  }
                >
                  <option value="">-- Pilih Kategori --</option>
                  {/* Kita gunakan data dari categoryLogic agar sinkron */}
                  {categoryLogic.categories.map((cat) => (
                    <option key={cat.kode_kategori} value={cat.kode_kategori}>
                      {cat.nama_kategori} ({cat.kode_kategori})
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Harga & Stok */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="0"
                    value={productLogic.formData.harga}
                    onChange={(e) =>
                      productLogic.setFormData({
                        ...productLogic.formData,
                        harga: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Stok
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="0"
                    value={productLogic.formData.stok}
                    onChange={(e) =>
                      productLogic.setFormData({
                        ...productLogic.formData,
                        stok: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={productLogic.closeModal}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={productLogic.loading}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {productLogic.loading
                    ? "Menyimpan..."
                    : productLogic.isEditMode
                    ? "Simpan Perubahan"
                    : "Buat Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL KATEGORI --- */}
      {categoryLogic.isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                {categoryLogic.isEditMode ? "Edit Kategori" : "Tambah Kategori"}
              </h2>
              <button
                onClick={categoryLogic.closeModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={categoryLogic.handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Kode Kategori
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: EMAS-24K"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none font-mono uppercase"
                  value={categoryLogic.formData.kode_kategori}
                  onChange={(e) =>
                    categoryLogic.setFormData({
                      ...categoryLogic.formData,
                      kode_kategori: e.target.value.toUpperCase(),
                    })
                  }
                />
                {categoryLogic.isEditMode && (
                  <p className="text-xs text-amber-600 mt-1">
                    Mengubah kode akan mempengaruhi produk terkait.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Emas Murni 24 Karat"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  value={categoryLogic.formData.nama_kategori}
                  onChange={(e) =>
                    categoryLogic.setFormData({
                      ...categoryLogic.formData,
                      nama_kategori: e.target.value,
                    })
                  }
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={categoryLogic.closeModal}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={categoryLogic.loading}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {categoryLogic.loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
