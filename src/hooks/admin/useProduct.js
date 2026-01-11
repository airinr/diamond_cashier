import { useState, useEffect } from "react";
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productServices";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State untuk Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    nama_produk: "",
    harga: "",
    stok: "",
    kode_kategori: "",
  });

  // 1. Fetch Data (Load Produk & Kategori)
  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodData, catData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      // Handle response array vs object wrapper
      setProducts(Array.isArray(prodData) ? prodData : prodData?.data || []);
      setCategories(Array.isArray(catData) ? catData : catData?.data || []);
    } catch (err) {
      setError(err.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Handlers untuk Modal
  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ nama_produk: "", harga: "", stok: "", kode_kategori: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setIsEditMode(true);
    setCurrentId(product.id_produk);
    setFormData({
      nama_produk: product.nama_produk,
      harga: product.harga,
      stok: product.stok,
      kode_kategori: product.kode_kategori,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  // 3. Handle Submit (Create / Update)
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await updateProduct(currentId, formData);
      } else {
        await createProduct(formData);
      }
      await fetchData(); // Refresh data
      closeModal();
    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;

    setLoading(true);
    try {
      await deleteProduct(id);
      await fetchData();
    } catch (err) {
      alert("Gagal menghapus: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
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
  };
};
