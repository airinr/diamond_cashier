import React, { use, useState } from "react";
import Sidebar from "../../components/sidebar";
import { Eye, Layers, Plus, Search, X } from "lucide-react"; // Tambah Eye
import { rupiah, cn } from "../../utils/formatters";
import { useSales } from "../../hooks/admin/useSales";
import { useProducts } from "../../hooks/admin/useProduct";
import { usePurchases } from "../../hooks/admin/usePurchases";

export default function TransactionPage() {
  const [activeTab, setActiveTab] = useState("penjualan");

  // --- Logic Transaksi ---
  const salesLogic = useSales();
  const purchaseLogic = usePurchases();

  // --- Logic Produk ---
  const productLogic = useProducts();

  // Helper untuk switch content
  const isJual = activeTab === "penjualan";

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar active="transaction" />
      <div className="ml-52 min-h-screen">
        {/* --- TOPBAR --- */}
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Manajemen Transaksi
              </h1>
              <p className="text-sm text-slate-500">
                Kelola Transaksi Penjualan dan Pembelian
              </p>
            </div>
            {/* Action Button Dinamis */}
            <button
              onClick={
                isJual ? salesLogic.openAddModal : purchaseLogic.openAddModal
              }
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:scale-95 transition"
            >
              <Plus size={16} />
              {isJual ? "Tambah Penjualan" : "Tambah Pembelian"}
            </button>
          </div>

          {/* --- TAB NAVIGATION --- */}
          <div className="mx-auto max-w-6xl px-4 mt-2">
            <div className="flex gap-6 border-b border-slate-200">
              <button
                onClick={() => setActiveTab("penjualan")}
                className={cn(
                  "pb-3 text-sm font-semibold transition border-b-2",
                  activeTab === "penjualan"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                )}
              >
                Penjualan
              </button>
              <button
                onClick={() => setActiveTab("pembelian")}
                className={cn(
                  "pb-3 text-sm font-semibold transition border-b-2",
                  activeTab === "pembelian"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                )}
              >
                Pembelian
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
                {isJual
                  ? `Daftar Transaksi Penjualan (${salesLogic.penjualan.length})`
                  : `Daftar Transaksi Pembelian (${purchaseLogic.pembelian.length})`}
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
              {isJual ? (
                // --- TABEL PENJUALAN ---
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Kode Transaksi</th>
                      <th className="px-6 py-4">Pembeli</th>
                      <th className="px-6 py-4 text-center">Item</th>
                      <th className="px-6 py-4 text-right">Total Bayar</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {salesLogic.penjualan.map((item) => {
                      // Logic hitung total
                      const hitungTotal = item.detail_produk?.reduce(
                        (total, detail) => {
                          const produkAsli = productLogic.products.find(
                            (p) => p.id_produk === detail.id_produk
                          );
                          const harga = produkAsli
                            ? Number(produkAsli.harga)
                            : 0;
                          return total + harga * Number(detail.jumlah);
                        },
                        0
                      );

                      return (
                        <tr
                          key={item.id_transaksi || item.kode_penjualan}
                          className="hover:bg-slate-50 transition"
                        >
                          {/* Kolom 1: Kode */}
                          <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                              <Layers size={20} />
                            </div>
                            <div>
                              <div className="font-bold">
                                #{item.kode_penjualan}
                              </div>
                              <div className="text-xs text-slate-400">
                                {new Date(
                                  item.created_at || Date.now()
                                ).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                            </div>
                          </td>

                          {/* Kolom 2: Pembeli */}
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-800">
                              {item.nama_pembeli}
                            </div>
                            <div className="text-xs text-slate-500">
                              {item.no_hp_pembeli || "-"}
                            </div>
                          </td>

                          {/* Kolom 3: Jumlah Item (Cuma angka aja sekarang) */}
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                              {item.detail_produk?.length || 0} Jenis
                            </span>
                          </td>

                          {/* Kolom 4: Total Bayar */}
                          <td className="px-6 py-4 text-right font-bold text-slate-900">
                            {rupiah(hitungTotal || 0)}
                          </td>

                          {/* Kolom 5: Aksi (Hanya Tombol Detail) */}
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => salesLogic.openDetailModal(item)}
                              className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition"
                            >
                              <Eye size={14} /> Detail
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {/* State Kosong */}
                    {salesLogic.penjualan.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-8 text-center text-slate-400"
                        >
                          Belum ada data transaksi penjualan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                // --- TABEL PEMBELIAN ---
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Kode Transaksi</th>
                      <th className="px-6 py-4">Pembeli</th>
                      <th className="px-6 py-4 text-center">Item</th>
                      <th className="px-6 py-4 text-right">Total Bayar</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {purchaseLogic.pembelian.map((item) => {
                      // Logic hitung total
                      const hitungTotal =
                        item.jumlah * (item.harga_beli || 0);

                      return (
                        <tr
                          key={item.id_transaksi || item.kode_pembelian}
                          className="hover:bg-slate-50 transition"
                        >
                          {/* Kolom 1: Kode */}
                          <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                              <Layers size={20} />
                            </div>
                            <div>
                              <div className="font-bold">
                                #{item.kode_pembelian}
                              </div>
                              <div className="text-xs text-slate-400">
                                {new Date(
                                  item.tgl_transaksi || Date.now()
                                ).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                            </div>
                          </td>

                          {/* Kolom 2: Penjual */}
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-800">
                              {item.nama_penjual}
                            </div>
                            <div className="text-xs text-slate-500">
                              {item.no_hp_penjual || "-"}
                            </div>
                          </td>

                          {/* Kolom 3: Barang yang dibeli */}
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                              {item.produk.nama_produk || "Produk dihapus"} x{" "}
                              {item.jumlah}
                            </span>
                          </td>

                          {/* Kolom 4: Total Bayar */}
                          <td className="px-6 py-4 text-right font-bold text-slate-900">
                            {rupiah(hitungTotal)}
                          </td>

                          {/* Kolom 5: Aksi (Hanya Tombol Detail) */}
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() =>
                                purchaseLogic.openDetailModal(item)
                              }
                              className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition"
                            >
                              <Eye size={14} /> Detail
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {/* State Kosong */}
                    {purchaseLogic.pembelian.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-8 text-center text-slate-400"
                        >
                          Belum ada data transaksi pembelian.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL PRODUK --- */}
      {salesLogic.isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                "Tambah Transaksi Penjualan"
              </h2>
              <button
                onClick={salesLogic.closeModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={salesLogic.handleSave} className="space-y-4">
              {/* --- BAGIAN 1: DATA PEMBELI & TRANSAKSI --- */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Kode Penjualan */}
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Kode Penjualan
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-slate-200 text-slate-600 focus:outline-none cursor-not-allowed font-bold"
                    placeholder="Otomatis"
                    value={salesLogic.formData.kode_penjualan}
                  />
                </div>

                {/* Nama Pembeli */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Nama Pembeli
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Contoh: Umum"
                    value={salesLogic.formData.nama_pembeli}
                    onChange={(e) =>
                      salesLogic.setFormData({
                        ...salesLogic.formData,
                        nama_pembeli: e.target.value,
                      })
                    }
                  />
                </div>

                {/* No HP Pembeli */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    No HP Pembeli
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="0812..."
                    value={salesLogic.formData.no_hp_pembeli}
                    onChange={(e) =>
                      salesLogic.setFormData({
                        ...salesLogic.formData,
                        no_hp_pembeli: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 my-4"></div>

              {/* --- BAGIAN 2: DETAIL PRODUK (ARRAY) --- */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Keranjang Belanja
                </label>

                <div className="space-y-3">
                  {salesLogic.formData.detail_produk.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      {/* Dropdown Pilih Produk */}
                      <div className="flex-1">
                        <select
                          required
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
                          value={item.id_produk || 0}
                          onChange={(e) => {
                            const newDetails = [
                              ...salesLogic.formData.detail_produk,
                            ];
                            newDetails[index].id_produk = Number(
                              e.target.value
                            );
                            salesLogic.setFormData({
                              ...salesLogic.formData,
                              detail_produk: newDetails,
                            });
                          }}
                        >
                          <option value={0}>-- Pilih Produk --</option>
                          {productLogic.products.map((prod) => (
                            <option key={prod.id_produk} value={prod.id_produk}>
                              {prod.nama_produk} (Stok: {prod.stok})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Input Jumlah */}
                      <div className="w-24">
                        <input
                          type="number"
                          required
                          min="1"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                          placeholder="Qty"
                          value={item.jumlah}
                          onChange={(e) => {
                            const newDetails = [
                              ...salesLogic.formData.detail_produk,
                            ];
                            newDetails[index].jumlah = number(e.target.value);
                            salesLogic.setFormData({
                              ...salesLogic.formData,
                              detail_produk: newDetails,
                            });
                          }}
                        />
                      </div>

                      {/* Tombol Hapus Baris (Opsional) */}
                      {salesLogic.formData.detail_produk.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newDetails =
                              salesLogic.formData.detail_produk.filter(
                                (_, i) => i !== index
                              );
                            salesLogic.setFormData({
                              ...salesLogic.formData,
                              detail_produk: newDetails,
                            });
                          }}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Tombol Tambah Produk Lain */}
                <button
                  type="button"
                  onClick={() => {
                    salesLogic.setFormData({
                      ...salesLogic.formData,
                      detail_produk: [
                        ...salesLogic.formData.detail_produk,
                        { id_produk: 0, jumlah: 1 }, // Default object baru
                      ],
                    });
                  }}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  + Tambah Produk Lain
                </button>
              </div>

              {/* --- TOMBOL AKSI --- */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={salesLogic.closeModal}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={salesLogic.loading}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {salesLogic.loading ? "Memproses..." : "Simpan Transaksi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DETAIL PENJUALAN --- */}
      {salesLogic.isDetailModalOpen && salesLogic.selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Header Modal */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-800">
                  Detail Transaksi
                </h3>
                <p className="text-sm text-slate-500 font-mono">
                  {salesLogic.selectedTransaction.kode_penjualan}
                </p>
              </div>
              <button
                onClick={salesLogic.closeDetailModal}
                className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body Modal (Info Pembeli & List Produk) */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Info Pembeli */}
              <div className="grid grid-cols-2 gap-4 mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div>
                  <label className="text-xs text-blue-600 font-semibold uppercase">
                    Pembeli
                  </label>
                  <div className="font-medium text-slate-800">
                    {salesLogic.selectedTransaction.nama_pembeli}
                  </div>
                </div>
                <div className="text-right">
                  <label className="text-xs text-blue-600 font-semibold uppercase">
                    Tanggal
                  </label>
                  <div className="font-medium text-slate-800">
                    {new Date(
                      salesLogic.selectedTransaction.tgl_transaksi || Date.now()
                    ).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>

              {/* Tabel Detail Produk */}
              <h4 className="text-sm font-semibold text-slate-700 mb-3">
                Rincian Barang
              </h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-2 font-medium">Produk</th>
                      <th className="px-4 py-2 font-medium text-center">Qty</th>
                      <th className="px-4 py-2 font-medium text-right">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {salesLogic.selectedTransaction.detail_produk.map(
                      (detail, idx) => {
                        const produk = productLogic.products.find(
                          (p) => p.id_produk === detail.id_produk
                        );
                        const harga = produk ? Number(produk.harga) : 0;
                        const subtotal = harga * detail.jumlah;

                        return (
                          <tr key={idx}>
                            <td className="px-4 py-2">
                              <div className="font-medium text-slate-800">
                                {produk?.nama_produk || "Produk dihapus"}
                              </div>
                              <div className="text-xs text-slate-500">
                                @ {rupiah(harga)}
                              </div>
                            </td>
                            <td className="px-4 py-2 text-center text-slate-600">
                              {detail.jumlah}
                            </td>
                            <td className="px-4 py-2 text-right font-medium text-slate-800">
                              {rupiah(subtotal)}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                  {/* Grand Total Footer */}
                  <tfoot className="bg-slate-50 border-t border-slate-200">
                    <tr>
                      <td
                        colSpan="2"
                        className="px-4 py-3 font-bold text-slate-700 text-right"
                      >
                        Total Akhir
                      </td>
                      <td className="px-4 py-3 font-bold text-blue-600 text-right text-lg">
                        {rupiah(
                          salesLogic.selectedTransaction.detail_produk.reduce(
                            (acc, detail) => {
                              const p = productLogic.products.find(
                                (i) => i.id_produk === detail.id_produk
                              );
                              return (
                                acc + (p ? Number(p.harga) : 0) * detail.jumlah
                              );
                            },
                            0
                          )
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Footer Modal Action */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
              <button
                onClick={salesLogic.closeDetailModal}
                className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL PEMBELIAN --- */}
      {purchaseLogic.isModalOpen && (
        // 👇 1. INI WRAPPER YANG HILANG (Backdrop Gelap)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          {/* 👇 2. INI CONTAINER FORM KAMU (Tetap sama, cuma tambah w-full) */}
          <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-2xl font-bold text-slate-800">
                Form Pembelian
              </h2>
              <button
                onClick={() => purchaseLogic.closeModal()}
                className="p-2 bg-white border border-slate-200 rounded-full hover:bg-red-50 text-slate-500 hover:text-red-500 transition"
              >
                <X size={20} />{" "}
              </button>
            </div>

            <div className="p-6">
              {/* --- TOGGLE SWITCH --- */}
              <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                <button
                  type="button"
                  onClick={() => purchaseLogic.setIsRestock(true)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    purchaseLogic.isRestock
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  🔄 Restock (Barang Lama)
                </button>
                <button
                  type="button"
                  onClick={() => purchaseLogic.setIsRestock(false)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    !purchaseLogic.isRestock
                      ? "bg-white text-green-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  ✨ Barang Baru
                </button>
              </div>

              <form onSubmit={purchaseLogic.handleSave} className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">
                    {purchaseLogic.isRestock
                      ? "Pilih Produk"
                      : "Detail Produk Baru"}
                  </h3>
                  {purchaseLogic.isRestock ? (
                    // Restok barang
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Pilih Produk
                      </label>
                      <select
                        name="id_produk"
                        value={purchaseLogic.formData.id_produk}
                        onChange={purchaseLogic.handleChange}
                        className="w-full border rounded p-2"
                        required={purchaseLogic.isRestock}
                      >
                        <option value="">-- Pilih Barang --</option>
                        {/* Map dari get produk */}
                        {productLogic.products.map((prod) => (
                          <option key={prod.id_produk} value={prod.id_produk}>
                            {prod.nama_produk} ({prod.kode_kategori}) -{" "}
                            {rupiah(prod.harga)}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    // Tambah produk baru lewat pembelian
                    <div className="space-y-4">
                      {/* 🔥 1. WIDGET AI PREDICTION (Baru) 🔥 */}
                      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 transition-all">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-sm font-bold text-indigo-800 flex items-center gap-2">
                            🔮 AI Price Estimator
                            <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                              BETA
                            </span>
                          </h4>
                          <button
                            type="button"
                            onClick={() =>
                              purchaseLogic.setShowPrediction(
                                !purchaseLogic.showPrediction
                              )
                            }
                            className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 underline decoration-dotted"
                          >
                            {purchaseLogic.showPrediction
                              ? "Tutup Prediksi"
                              : "Buka Prediksi"}
                          </button>
                        </div>

                        {/* Form Prediksi (Toggle) */}
                        {purchaseLogic.showPrediction && (
                          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              {/* Input Carat */}
                              <div>
                                <label className="text-xs font-semibold text-indigo-600">
                                  Carat (Berat)
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  name="carat"
                                  value={purchaseLogic.predData.carat}
                                  onChange={purchaseLogic.handlePredChange}
                                  className="w-full border border-indigo-200 rounded p-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                              </div>
                              {/* Select Cut */}
                              <div>
                                <label className="text-xs font-semibold text-indigo-600">
                                  Cut
                                </label>
                                <select
                                  name="cut"
                                  value={purchaseLogic.predData.cut}
                                  onChange={purchaseLogic.handlePredChange}
                                  className="w-full border border-indigo-200 rounded p-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                  <option value="1">1 - Fair</option>
                                  <option value="2">2 - Good</option>
                                  <option value="3">3 - Very Good</option>
                                  <option value="4">4 - Premium</option>
                                  <option value="5">5 - Ideal</option>
                                </select>
                              </div>
                              {/* Select Color */}
                              <div>
                                <label className="text-xs font-semibold text-indigo-600">
                                  Color
                                </label>
                                <select
                                  name="color"
                                  value={purchaseLogic.predData.color}
                                  onChange={purchaseLogic.handlePredChange}
                                  className="w-full border border-indigo-200 rounded p-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                  <option value="1">1 - J (Kuning)</option>
                                  <option value="2">2 - I</option>
                                  <option value="3">3 - H</option>
                                  <option value="4">4 - G</option>
                                  <option value="5">5 - F</option>
                                  <option value="6">6 - E</option>
                                  <option value="7">
                                    7 - D (Paling Putih)
                                  </option>
                                </select>
                              </div>
                              {/* Select Clarity */}
                              <div>
                                <label className="text-xs font-semibold text-indigo-600">
                                  Clarity
                                </label>
                                <select
                                  name="clarity"
                                  value={purchaseLogic.predData.clarity}
                                  onChange={purchaseLogic.handlePredChange}
                                  className="w-full border border-indigo-200 rounded p-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                  <option value="1">1 - I1</option>
                                  <option value="2">2 - SI2</option>
                                  <option value="3">3 - SI1</option>
                                  <option value="4">4 - VS2</option>
                                  <option value="5">5 - VS1</option>
                                  <option value="6">6 - VVS2</option>
                                  <option value="7">7 - VVS1</option>
                                  <option value="8">8 - IF (Sempurna)</option>
                                </select>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={purchaseLogic.handlePredict}
                              disabled={purchaseLogic.loadingPrediction}
                              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-2 rounded-lg shadow-sm transition flex justify-center items-center gap-2 disabled:opacity-70"
                            >
                              {purchaseLogic.loadingPrediction
                                ? "Menghitung..."
                                : "⚡ Hitung Estimasi Harga"}
                            </button>

                            {/* Hasil Prediksi */}
                            {purchaseLogic.predictedPrice !== null && (
                              <div className="mt-3 bg-white p-3 rounded-lg border border-indigo-100 text-center shadow-sm">
                                <div className="text-xs text-slate-500 uppercase tracking-wide">
                                  Estimasi Market Value
                                </div>
                                <div className="text-xl font-bold text-indigo-700 my-1">
                                  {rupiah(purchaseLogic.predictedPrice)}
                                </div>
                                <button
                                  type="button"
                                  onClick={purchaseLogic.applyPrediction}
                                  className="text-xs bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full hover:bg-indigo-100 font-bold border border-indigo-200 transition"
                                >
                                  Gunakan Harga Ini
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* 2. FORM INPUT BARANG BARU (Original) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-medium mb-1">
                            Nama Produk Baru
                          </label>
                          <input
                            name="nama_produk_baru"
                            value={purchaseLogic.formData.nama_produk_baru}
                            onChange={purchaseLogic.handleChange}
                            className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Contoh: Gelang Berlian"
                            required={!purchaseLogic.isRestock}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Kode Kategori
                          </label>
                          <input
                            name="kode_kategori_baru"
                            value={purchaseLogic.formData.kode_kategori_baru}
                            onChange={purchaseLogic.handleChange}
                            className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Contoh: KB, CP"
                            required={!purchaseLogic.isRestock}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 flex justify-between">
                            Rencana Harga Jual
                          </label>
                          <input
                            type="number"
                            name="harga_jual_baru"
                            value={purchaseLogic.formData.harga_jual_baru}
                            onChange={purchaseLogic.handleChange}
                            className={`w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                              purchaseLogic.predictedPrice ===
                              purchaseLogic.formData.harga_jual_baru
                                ? "border-green-400 bg-green-50"
                                : ""
                            }`}
                            placeholder="Rp 0"
                            required={!purchaseLogic.isRestock}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Jumlah Barang
                    </label>
                    <input
                      type="number"
                      min="1"
                      name="jumlah"
                      value={purchaseLogic.formData.jumlah}
                      onChange={purchaseLogic.handleChange}
                      className="w-full border rounded p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Harga Beli (Modal)
                    </label>
                    <input
                      type="number"
                      name="harga_beli"
                      value={purchaseLogic.formData.harga_beli}
                      onChange={purchaseLogic.handleChange}
                      className="w-full border rounded p-2"
                      required
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">
                    Data Penjual / Supplier
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Nama Penjual
                      </label>
                      <input
                        name="nama_penjual"
                        value={purchaseLogic.formData.nama_penjual}
                        onChange={purchaseLogic.handleChange}
                        className="w-full border rounded p-2"
                        placeholder="Toko Emas Pusat"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        No HP Penjual
                      </label>
                      <input
                        name="no_hp_penjual"
                        value={purchaseLogic.formData.no_hp_penjual}
                        onChange={purchaseLogic.handleChange}
                        className="w-full border rounded p-2"
                        placeholder="0812..."
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={purchaseLogic.loading}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {purchaseLogic.loading ? "Menyimpan..." : "Simpan Pembelian"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DETAIL PEMBELIAN --- */}
      {purchaseLogic.isDetailModalOpen && purchaseLogic.selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* 1. Header Modal */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-800">
                  Detail Pembelian
                </h3>
                <p className="text-sm text-slate-500 font-mono">
                  #{purchaseLogic.selectedTransaction.kode_pembelian}
                </p>
              </div>
              <button
                onClick={purchaseLogic.closeDetailModal}
                className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* 2. Body Modal */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Info Supplier/Penjual */}
              <div className="grid grid-cols-2 gap-4 mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div>
                  <label className="text-xs text-blue-600 font-semibold uppercase">
                    Supplier / Penjual
                  </label>
                  <div className="font-medium text-slate-800">
                    {purchaseLogic.selectedTransaction.nama_penjual || "-"}
                  </div>
                </div>
                <div className="text-right">
                  <label className="text-xs text-blue-600 font-semibold uppercase">
                    Tanggal Transaksi
                  </label>
                  <div className="font-medium text-slate-800">
                    {new Date(
                      purchaseLogic.selectedTransaction.tgl_transaksi ||
                        Date.now()
                    ).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>

              {/* Tabel Detail Produk */}
              <h4 className="text-sm font-semibold text-slate-700 mb-3">
                Rincian Barang Masuk
              </h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-2 font-medium">Produk</th>
                      <th className="px-4 py-2 font-medium text-center">Qty</th>
                      <th className="px-4 py-2 font-medium text-right">
                        Total Harga
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* Karena JSON kamu produknya cuma satu (object), tidak perlu .map() */}
                    <tr>
                      <td className="px-4 py-2">
                        <div className="font-medium text-slate-800">
                          {purchaseLogic.selectedTransaction.produk
                            ?.nama_produk || "Produk Tidak Dikenal"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {/* Asumsi harga di JSON adalah harga satuan */}@{" "}
                          {rupiah(
                            purchaseLogic.selectedTransaction.produk?.harga || 0
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center text-slate-600">
                        {purchaseLogic.selectedTransaction.jumlah}
                      </td>
                      <td className="px-4 py-2 text-right font-medium text-slate-800">
                        {rupiah(
                          (purchaseLogic.selectedTransaction.harga_beli ||
                            0) * purchaseLogic.selectedTransaction.jumlah
                        )}
                      </td>
                    </tr>
                  </tbody>

                  {/* Grand Total Footer */}
                  <tfoot className="bg-slate-50 border-t border-slate-200">
                    <tr>
                      <td
                        colSpan="2"
                        className="px-4 py-3 font-bold text-slate-700 text-right"
                      >
                        Total Bayar
                      </td>
                      <td className="px-4 py-3 font-bold text-blue-600 text-right text-lg">
                        {rupiah(
                          (purchaseLogic.selectedTransaction.harga_beli ||
                            0) * purchaseLogic.selectedTransaction.jumlah
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* 3. Footer Modal Action */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
              <button
                onClick={purchaseLogic.closeDetailModal}
                className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
