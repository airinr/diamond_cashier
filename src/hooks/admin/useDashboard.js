// src/hooks/admin/useDashboard.js
import { useState, useEffect, useMemo } from "react";
// Perhatikan path import services Anda (naik 2 level dari hooks/admin)
import { getProducts } from "../../services/productServices";

// Helper mapper (bisa juga dipindah ke utils jika mau)
const mapProductFromApi = (x) => ({
  id: String(x?.id_produk ?? ""),
  name: x?.nama_produk ?? "-",
  category: x?.kode_kategori ?? "-",
  price: Number(x?.harga ?? 0),
  stock: Number(x?.stok ?? 0),
  image:
    "https://images.unsplash.com/photo-1664044020180-b75bfddf9776?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
});

export const useDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorProducts, setErrorProducts] = useState("");

  // State dummy transaksi (nanti bisa diganti API real)
  const [transactions] = useState([
    {
      id: "#TRX-9801",
      date: "2026-01-03 14:30",
      customer: "Budi Santoso",
      items: 3,
      method: "QRIS",
      status: "PAID",
      total: 150000,
    },
    {
      id: "#TRX-9802",
      date: "2026-01-03 14:35",
      customer: "Siti Aminah",
      items: 1,
      method: "CASH",
      status: "PENDING",
      total: 50000,
    },
  ]);

  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);

  // --- 1. FETCHING DATA ---
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoadingProducts(true);
      setErrorProducts("");
      try {
        const data = await getProducts();
        const list = Array.isArray(data) ? data : data?.data;

        if (!alive) return;

        if (Array.isArray(list) && list.length > 0) {
          const mapped = list.map(mapProductFromApi);
          setProducts(mapped);
        } else {
          setProducts([]);
        }
      } catch (err) {
        if (!alive) return;
        setErrorProducts(err?.message || "Gagal mengambil produk");
        setProducts([]);
      } finally {
        // eslint-disable-next-line no-unsafe-finally
        if (!alive) return;
        setLoadingProducts(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // --- 2. COMPUTED LOGIC (Filter & Stats) ---
  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;

    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const cat = (p.category || "").toLowerCase();
      const id = (p.id || "").toLowerCase();
      return name.includes(q) || cat.includes(q) || id.includes(q);
    });
  }, [products, query]);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalStock = products.reduce(
      (sum, p) => sum + (Number(p.stock) || 0),
      0
    );
    // Hitung revenue hari ini (contoh logic sederhana)
    const todayRevenue = transactions
      .filter((t) => t.date && t.date.includes("2026-01-03"))
      .reduce((sum, t) => sum + (Number(t.total) || 0), 0);

    return { totalProducts, totalStock, todayRevenue };
  }, [products, transactions]);

  // --- 3. ACTIONS ---
  const addToCart = (p) => {
    setCart((prev) => {
      const idx = prev.findIndex((x) => x.id === p.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }];
    });
  };

  return {
    products,
    loadingProducts,
    errorProducts,
    transactions,
    query,
    cart,
    filteredProducts,
    stats,
    setQuery,
    addToCart,
  };
};
