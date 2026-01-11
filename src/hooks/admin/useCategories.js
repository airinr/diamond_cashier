import { useState, useEffect } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/productServices";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Kita butuh menyimpan Kode Lama untuk keperluan URL saat Update
  const [currentCode, setCurrentCode] = useState(null);

  const [formData, setFormData] = useState({
    kode_kategori: "",
    nama_kategori: "",
  });

  // Fetch Data
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Modal Handlers
  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ kode_kategori: "", nama_kategori: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setIsEditMode(true);
    setCurrentCode(cat.kode_kategori); // Simpan kode lama
    setFormData({
      kode_kategori: cat.kode_kategori,
      nama_kategori: cat.nama_kategori,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  // CRUD Actions
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        // Param 1: Kode Lama (URL), Param 2: Body Baru
        await updateCategory(currentCode, formData);
      } else {
        await createCategory(formData);
      }
      await fetchCategories(); // Refresh list
      closeModal();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (code) => {
    if (
      !window.confirm(`Hapus kategori ${code}? Produk terkait mungkin error.`)
    )
      return;
    setLoading(true);
    try {
      await deleteCategory(code);
      await fetchCategories();
    } catch (err) {
      alert("Gagal menghapus: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    isModalOpen,
    isEditMode,
    formData,
    setFormData,
    openAddModal,
    openEditModal,
    closeModal,
    handleSave,
    handleDelete,
    refreshCategories: fetchCategories, // Expose ini jika ProductPage butuh refresh dropdown
  };
};
