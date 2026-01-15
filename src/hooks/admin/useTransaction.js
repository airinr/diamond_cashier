import { useState, useEffect } from "react";
import { 
  getPenjualan,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../services/transactionServices";
import { updateProduct } from "../../services/productServices";

export const useTransactions = () => {
  const [pembelian, setPembelian] = useState([]);
  const [penjualan, setPenjualan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State untuk Modal & Form
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    nama_pembeli: "",
    no_hp_pembeli: "",
    kode_penjualan: "",
    detail_produk: [
      { id_produk: 0, jumlah: 0 }
    ]
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
    // Bikin random angka/huruf (misal 5 karakter)
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    
    // Format: #TRX-RANDOM (Contoh: #TRX-X7A2B)
    return `#TRX-${randomStr}`;
  };

  // 2. Handlers untuk Modal
  const openAddModal = () => {
    setIsEditMode(false);

    const autoKode = generateKodeTransaksi();

    setFormData({
      nama_pembeli: "Umum",
      no_hp_pembeli: "",
      kode_penjualan: autoKode,
      detail_produk: [
        { id_produk: 0, jumlah: 1 }
      ]
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
      if (isEditMode) {
        await updateTransaction(currentId, formData);
      } else {
        await createTransaction(formData);
      }
      await fetchData(); // Refresh data
      closeModal();
    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    pembelian,
    penjualan,
    openAddModal,
    closeModal,
    handleSave,
    loading,
    error,
    isModalOpen,
    isEditMode,
    formData,
    setFormData,
    openDetailModal,
    closeDetailModal,
    selectedTransaction,
    isDetailModalOpen,
  };
};
