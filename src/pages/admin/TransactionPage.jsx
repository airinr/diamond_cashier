import React, { useState } from "react";
import Sidebar from "../../components/sidebar";
import { Eye, Layers, Plus, Search, X } from "lucide-react"; // Tambah Eye
import { rupiah, cn } from "../../utils/formatters";
import { useTransactions } from "../../hooks/admin/useTransaction";
import { useProducts } from "../../hooks/admin/useProduct";

export default function TransactionPage() {
  const [activeTab, setActiveTab] = useState("penjualan");

  // --- Logic Transaksi ---
  const transactionLogic = useTransactions();

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
              onClick={transactionLogic.openAddModal}
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
                  ? `Daftar Transaksi Penjualan (${transactionLogic.penjualan.length})`
                  : `Daftar Transaksi Pembelian (${transactionLogic.pembelian.length})`}
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
                      <th className="px-6 py-4 text-center">Aksi</th>{" "}
                      {/* Header Aksi tetap ada */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactionLogic.penjualan.map((item) => {
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
                                {item.kode_penjualan}
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
                              onClick={() =>
                                transactionLogic.openDetailModal(item)
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
                    {transactionLogic.penjualan.length === 0 && (
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
                <h3>Pembelian</h3>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* --- MODAL PRODUK --- */}
      {transactionLogic.isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                {transactionLogic.isEditMode
                  ? "Edit Transaksi Penjualan"
                  : "Tambah Transaksi Penjualan"}
              </h2>
              <button
                onClick={transactionLogic.closeModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={transactionLogic.handleSave} className="space-y-4">
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
                    value={transactionLogic.formData.kode_penjualan}
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
                    value={transactionLogic.formData.nama_pembeli}
                    onChange={(e) =>
                      transactionLogic.setFormData({
                        ...transactionLogic.formData,
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
                    value={transactionLogic.formData.no_hp_pembeli}
                    onChange={(e) =>
                      transactionLogic.setFormData({
                        ...transactionLogic.formData,
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
                  {transactionLogic.formData.detail_produk.map(
                    (item, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        {/* Dropdown Pilih Produk */}
                        <div className="flex-1">
                          <select
                            required
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
                            value={item.id_produk || 0}
                            onChange={(e) => {
                              const newDetails = [
                                ...transactionLogic.formData.detail_produk,
                              ];
                              newDetails[index].id_produk = Number(
                                e.target.value
                              );
                              transactionLogic.setFormData({
                                ...transactionLogic.formData,
                                detail_produk: newDetails,
                              });
                            }}
                          >
                            <option value={0}>-- Pilih Produk --</option>
                            {productLogic.products.map((prod) => (
                              <option
                                key={prod.id_produk}
                                value={prod.id_produk}
                              >
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
                                ...transactionLogic.formData.detail_produk,
                              ];
                              newDetails[index].jumlah = parseInt(
                                e.target.value
                              );
                              transactionLogic.setFormData({
                                ...transactionLogic.formData,
                                detail_produk: newDetails,
                              });
                            }}
                          />
                        </div>

                        {/* Tombol Hapus Baris (Opsional) */}
                        {transactionLogic.formData.detail_produk.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newDetails =
                                transactionLogic.formData.detail_produk.filter(
                                  (_, i) => i !== index
                                );
                              transactionLogic.setFormData({
                                ...transactionLogic.formData,
                                detail_produk: newDetails,
                              });
                            }}
                            className="p-2 text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>

                {/* Tombol Tambah Produk Lain */}
                <button
                  type="button"
                  onClick={() => {
                    transactionLogic.setFormData({
                      ...transactionLogic.formData,
                      detail_produk: [
                        ...transactionLogic.formData.detail_produk,
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
                  onClick={transactionLogic.closeModal}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={transactionLogic.loading}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {transactionLogic.loading
                    ? "Memproses..."
                    : "Simpan Transaksi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DETAIL TRANSAKSI --- */}
      {transactionLogic.isDetailModalOpen &&
        transactionLogic.selectedTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
              {/* Header Modal */}
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">
                    Detail Transaksi
                  </h3>
                  <p className="text-sm text-slate-500 font-mono">
                    {transactionLogic.selectedTransaction.kode_penjualan}
                  </p>
                </div>
                <button
                  onClick={transactionLogic.closeDetailModal}
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
                      {transactionLogic.selectedTransaction.nama_pembeli}
                    </div>
                  </div>
                  <div className="text-right">
                    <label className="text-xs text-blue-600 font-semibold uppercase">
                      Tanggal
                    </label>
                    <div className="font-medium text-slate-800">
                      {new Date(
                        transactionLogic.selectedTransaction.created_at ||
                          Date.now()
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
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
                        <th className="px-4 py-2 font-medium text-center">
                          Qty
                        </th>
                        <th className="px-4 py-2 font-medium text-right">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactionLogic.selectedTransaction.detail_produk.map(
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
                            transactionLogic.selectedTransaction.detail_produk.reduce(
                              (acc, detail) => {
                                const p = productLogic.products.find(
                                  (i) => i.id_produk === detail.id_produk
                                );
                                return (
                                  acc +
                                  (p ? Number(p.harga) : 0) * detail.jumlah
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
                  onClick={transactionLogic.closeDetailModal}
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
