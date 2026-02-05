import { useState, useEffect } from "react";
import {
  getPembelian,
  createPurchase,
  predictPrice,
} from "../../services/transactionServices";
import * as XLSX from "xlsx";

export const usePurchases = () => {
  const [pembelian, setPembelian] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State untuk Modal & Form
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRestock, setIsRestock] = useState(false);

  // Untuk prediksi
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [showPrediction, setShowPrediction] = useState(false);

  //untuk rentang export excel
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    // Field Umum (Ada di kedua tipe)
    kode_pembelian: "",
    nama_penjual: "",
    no_hp_penjual: "",
    jumlah: 0,
    harga_beli: 0,

    // Field Khusus Restock
    id_produk: "",

    // Field Khusus Barang Baru
    nama_produk_baru: "",
    kode_kategori_baru: "",
    harga_jual_baru: 0,
  });

  // State Form Prediksi
  const [predData, setPredData] = useState({
    carat: 0.5,
    cut: 1, // 1-5
    color: 1, // 1-7
    clarity: 1, // 1-8
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pemData] = await Promise.all([getPembelian()]);
      // Handle response array vs object wrapper
      setPembelian(Array.isArray(pemData) ? pemData : pemData?.data || []);
    } catch (err) {
      setError(err.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Input Prediksi
  const handlePredChange = (e) => {
    const { name, value } = e.target;

    setPredData((prev) => ({
      ...prev,
      [name]: name === "carat" ? parseFloat(value) : parseInt(value),
    }));
  };

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
    // Contoh Output: #PO-20260116-XY7Z9
    return `PO-${year}${month}${day}-${randomStr}`;
  };

  // 2. Handlers untuk Modal
  const openAddModal = () => {
    const autoKode = generateKodeTransaksi();

    setFormData({
      // Field Umum (Ada di kedua tipe)
      kode_pembelian: autoKode,
      nama_penjual: "",
      no_hp_penjual: "",
      jumlah: 0,
      harga_beli: 0,

      // Field Khusus Restock
      id_produk: "",

      // Field Khusus Barang Baru
      nama_produk_baru: "",
      kode_kategori_baru: "",
      harga_jual_baru: 0,
    });
    setIsModalOpen(true);
  };

  // Action: Hitung Harga
  const handlePredict = async () => {
    setLoadingPrediction(true);
    setPredictedPrice(null);
    try {
      const result = await predictPrice(predData);
      setPredictedPrice(result.estimated_price);
    } catch (err) {
      alert("Gagal memprediksi: " + err.message);
    } finally {
      setLoadingPrediction(false);
    }
  };

  // Action: Apply Harga ke Form Utama
  const applyPrediction = () => {
    if (predictedPrice) {
      setFormData((prev) => ({
        ...prev,
        harga_beli: predictedPrice, // Masuk ke rencana harga jual
        // Atau kalau mau masuk ke harga_beli, tinggal ganti key-nya
      }));
      setShowPrediction(false); // Tutup menu prediksi
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. SIAPKAN PAYLOAD
      let payload = {};

      if (isRestock) {
        // --- KASUS A: RESTOCK ---
        payload = {
          kode_pembelian: formData.kode_pembelian,
          id_produk: parseInt(formData.id_produk),
          jumlah: parseInt(formData.jumlah),
          harga_beli: parseInt(formData.harga_beli),
          nama_penjual: formData.nama_penjual,
          no_hp_penjual: formData.no_hp_penjual,
        };
      } else {
        // --- KASUS B: BARANG BARU ---
        payload = {
          kode_pembelian: generateKodeTransaksi(),
          id_produk: null,
          nama_produk_baru: formData.nama_produk_baru,
          kode_kategori_baru: formData.kode_kategori_baru,
          harga_jual_baru: parseInt(formData.harga_jual_baru),
          jumlah: parseInt(formData.jumlah),
          harga_beli: parseInt(formData.harga_beli),
          nama_penjual: formData.nama_penjual,
          no_hp_penjual: formData.no_hp_penjual,
        };
      }

      // 2. KIRIM DATA
      await createPurchase(payload);

      await fetchData(); // Refresh tabel
      closeModal(); // Tutup modal
      alert("Pembelian berhasil disimpan!");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan: " + (err.message || "Terjadi kesalahan"));
    } finally {
      setLoading(false);
    }
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

  const handleExportPembelianExcel = () => {
    // 1. Validasi: Pastikan data ada
    if (!pembelian || pembelian.length === 0) {
      alert("Tidak ada data pembelian untuk diexport.");
      return;
    }

    // 2. Validasi: Pastikan Tanggal Dipilih
    if (!exportStartDate || !exportEndDate) {
      alert("Harap pilih Tanggal Mulai dan Tanggal Selesai terlebih dahulu!");
      return;
    }

    // 3. Filter Data Berdasarkan Rentang Tanggal
    const start = new Date(exportStartDate);
    const end = new Date(exportEndDate);
    // Set jam akhir ke 23:59:59 agar transaksi di hari terakhir tetap masuk
    end.setHours(23, 59, 59);

    const filteredData = pembelian.filter((item) => {
      if (!item.tgl_transaksi) return false;
      const itemDate = new Date(item.tgl_transaksi);
      return itemDate >= start && itemDate <= end;
    });

    if (filteredData.length === 0) {
      alert("Tidak ada transaksi pada rentang tanggal tersebut.");
      return;
    }

    // 4. Mapping Data (Format Sesuai Gambar)
    const excelData = filteredData.map((item) => {
      const totalBayar = (item.harga_beli || 0) * (item.jumlah || 0);
      const namaProduk =
        item.produk?.nama_produk || item.nama_produk_baru || "Produk dihapus";

      return {
        "Kode Transaksi": item.kode_pembelian,
        Tanggal: new Date(item.tgl_transaksi).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        "Pembeli / Supplier": item.nama_penjual,
        "No HP": item.no_hp_penjual,
        Item: `${namaProduk} x ${item.jumlah}`,
        "Total Bayar": totalBayar,
      };
    });

    // 5. Buat File Excel
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Pembelian");

    const columnWidths = [
      { wch: 25 },
      { wch: 15 },
      { wch: 25 },
      { wch: 15 },
      { wch: 40 },
      { wch: 20 },
    ];
    worksheet["!cols"] = columnWidths;

    XLSX.writeFile(
      workbook,
      `Laporan_Pembelian_${exportStartDate}_sd_${exportEndDate}.xlsx`,
    );
  };

  return {
    pembelian,
    openAddModal,
    closeModal,
    handleSave,
    handleChange,
    loading,
    error,
    isModalOpen,
    formData,
    setFormData,
    openDetailModal,
    closeDetailModal,
    selectedTransaction,
    isDetailModalOpen,
    isRestock,
    setIsRestock,
    loadingPrediction,
    predictedPrice,
    showPrediction,
    setShowPrediction,
    predData,
    handlePredChange,
    handlePredict,
    applyPrediction,
    exportStartDate,
    setExportStartDate,
    exportEndDate,
    setExportEndDate,
    handleExportPembelianExcel,
  };
};
