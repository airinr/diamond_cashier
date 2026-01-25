import { useState, useEffect } from "react";
import {
  getPenjualan,
  createTransaction,
} from "../../services/transactionServices";
import * as XLSX from "xlsx";

export const useSales = () => {
  const [penjualan, setPenjualan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State untuk Modal & Form
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //rentang export
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    nama_pembeli: "",
    no_hp_pembeli: "",
    kode_penjualan: "",
    detail_produk: [{ id_produk: 0, jumlah: 0 }],
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [penData] = await Promise.all([getPenjualan()]);

      // Handle response array vs object wrapper
      setPenjualan(Array.isArray(penData) ? penData : penData?.data || []);
    } catch (err) {
      setError(err.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi Generator Kode
  const generateKodeTransaksi = () => {
    const date = new Date();

    const year = date.getFullYear();
    // Tambah padStart(2, '0') biar bulan 1 jadi '01'
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Random string 5 karakter (Huruf Besar)
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();

    // Gabungin
    // Contoh Output: #TRX-20260116-XY7Z9
    return `TRX-${year}${month}${day}-${randomStr}`;
  };

  // 2. Handlers untuk Modal
  const openAddModal = () => {
    const autoKode = generateKodeTransaksi();

    setFormData({
      nama_pembeli: "Umum",
      no_hp_pembeli: "",
      kode_penjualan: autoKode,
      detail_produk: [{ id_produk: 0, jumlah: 1 }],
    });
    setIsModalOpen(true);
  };

  const openDetailModal = (transaction) => {
    setSelectedTransaction(transaction); // Simpan data transaksi yang diklik
    setIsDetailModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTransaction(null);
  };

  // 3. Handle Submit (Create / Update)
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTransaction(formData);
      await fetchData(); // Refresh data
      closeModal();
    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPenjualanExcel = (products) => {
    // A. Validasi Data
    if (!penjualan || penjualan.length === 0) {
      alert("Tidak ada data penjualan untuk diexport.");
      return;
    }

    // B. Validasi Tanggal
    if (!exportStartDate || !exportEndDate) {
      alert("Harap pilih Tanggal Mulai dan Tanggal Selesai terlebih dahulu!");
      return;
    }

    // C. Filter Data
    const start = new Date(exportStartDate);
    const end = new Date(exportEndDate);
    end.setHours(23, 59, 59); // Sampai akhir hari

    const filteredData = penjualan.filter((item) => {
      // Gunakan created_at atau tgl_transaksi (sesuaikan dengan database Anda)
      const tgl = item.tgl_transaksi || item.created_at;
      if (!tgl) return false;
      const itemDate = new Date(tgl);
      return itemDate >= start && itemDate <= end;
    });

    if (filteredData.length === 0) {
      alert("Tidak ada transaksi pada rentang tanggal tersebut.");
      return;
    }

    // D. Mapping Data ke Format Excel
    const excelData = filteredData.map((item) => {
      let totalTrans = 0;

      // Logic: Menggabungkan item-item dalam satu transaksi menjadi string
      // Contoh hasil: "Cincin Emas x 1, Gelang x 2"
      const itemDetails = item.detail_produk
        .map((detail) => {
          // Cari data produk asli untuk dapat Nama & Harga
          // (Karena di tabel penjualan biasanya cuma simpan ID)
          const product = products.find(
            (p) => p.id_produk === detail.id_produk,
          );

          const namaProduk = product ? product.nama_produk : "Produk dihapus";
          const harga = product ? parseInt(product.harga) : 0;

          // Hitung subtotal
          totalTrans += harga * detail.jumlah;

          return `${namaProduk} x ${detail.jumlah}`;
        })
        .join(", "); // Gabungkan array string dengan koma

      return {
        "Kode Transaksi": item.kode_penjualan,
        Tanggal: new Date(
          item.tgl_transaksi || item.created_at || Date.now(),
        ).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        Pembeli: item.nama_pembeli,
        "No HP": item.no_hp_pembeli || "-",
        Item: itemDetails, // String gabungan
        "Total Bayar": totalTrans,
      };
    });

    // E. Buat File Excel
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Penjualan");

    // Atur lebar kolom agar rapi
    const columnWidths = [
      { wch: 25 }, // Kode
      { wch: 15 }, // Tanggal
      { wch: 20 }, // Pembeli
      { wch: 15 }, // No HP
      { wch: 50 }, // Item (Lebar karena isinya detail)
      { wch: 20 }, // Total
    ];
    worksheet["!cols"] = columnWidths;

    XLSX.writeFile(
      workbook,
      `Laporan_Penjualan_${exportStartDate}_sd_${exportEndDate}.xlsx`,
    );
  };

  return {
    penjualan,
    openAddModal,
    closeModal,
    handleSave,
    loading,
    error,
    isModalOpen,
    formData,
    setFormData,
    openDetailModal,
    closeDetailModal,
    selectedTransaction,
    isDetailModalOpen,
    exportStartDate,
    setExportStartDate,
    exportEndDate,
    setExportEndDate,
    handleExportPenjualanExcel,
  };
};
