// src/hooks/admin/useDashboard.js
import { useState, useEffect, useMemo } from "react";
import { getProducts } from "../../services/productServices";
import { getPenjualan } from "../../services/transactionServices";

// Helper mapper produk
const mapProductFromApi = (x) => ({
  id: String(x?.id_produk ?? ""),
  name: x?.nama_produk ?? "-",
  category: x?.kode_kategori ?? "-",
  price: Number(x?.harga ?? 0),
  stock: Number(x?.stok ?? 0),
  image:
    "https://images.unsplash.com/photo-1664044020180-b75bfddf9776?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
});

// 🔥 PERBAIKAN MAPPER TRANSAKSI 🔥
const mapTransactionFromApi = (x) => {
  // Hitung total bayar berdasarkan struktur JSON Anda yang nested
  const calculatedTotal =
    x?.detail_produk?.reduce((sum, item) => {
      // Cek harga di dalam object 'produk' dulu, kalau tidak ada baru cek di root item
      const hargaBarang = Number(item.produk?.harga ?? item.harga ?? 0);
      const jumlahBarang = Number(item.jumlah ?? 0);
      return sum + hargaBarang * jumlahBarang;
    }, 0) || 0;

  return {
    id: x?.kode_penjualan || "-",
    date: x?.tgl_transaksi || x?.created_at || new Date().toISOString(),
    customer: x?.nama_pembeli || "Umum",
    items: x?.detail_produk?.length || 0,
    method: "CASH",
    status: "PAID",
    total: calculatedTotal, // Hasil perhitungan yang benar
  };
};

export const useDashboard = () => {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);

  // --- 1. FETCHING DATA ---
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");

      try {
        const [resProducts, resTransactions] = await Promise.all([
          getProducts(),
          getPenjualan(),
        ]);

        if (!alive) return;

        // --- Handle Products ---
        const listProd = Array.isArray(resProducts)
          ? resProducts
          : resProducts?.data;
        if (Array.isArray(listProd) && listProd.length > 0) {
          setProducts(listProd.map(mapProductFromApi));
        } else {
          setProducts([]);
        }

        // --- Handle Transactions ---
        const listTrans = Array.isArray(resTransactions)
          ? resTransactions
          : resTransactions?.data;
        if (Array.isArray(listTrans) && listTrans.length > 0) {
          const sortedTrans = listTrans.sort(
            (a, b) =>
              new Date(b.created_at || b.tgl_transaksi) -
              new Date(a.created_at || a.tgl_transaksi),
          );
          setTransactions(sortedTrans.map(mapTransactionFromApi));
        } else {
          setTransactions([]);
        }
      } catch (err) {
        if (!alive) return;
        console.error("Dashboard Fetch Error:", err);
        setError(err?.message || "Gagal memuat data dashboard");
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // --- 2. COMPUTED LOGIC ---
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
      0,
    );

    // Ambil waktu lokal hari ini
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 🔥 PERBAIKAN LOGIC OMZET HARI INI 🔥
    // Kita filter transaksi yang tanggalnya SAMA dengan hari ini (Local Time)
    const todayRevenue = transactions
      .filter((t) => {
        if (!t.date) return false;
        const tDate = new Date(t.date);

        return (
          tDate.getDate() === currentDay &&
          tDate.getMonth() === currentMonth &&
          tDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + (Number(t.total) || 0), 0);

    // 🔥 LOGIC OMZET TOTAL / SEMUA WAKTU (OPSIONAL) 🔥
    // Jika Anda ingin melihat total omzet dari SEMUA data (termasuk 2025), pakai variable ini:
    // const totalAllTimeRevenue = transactions.reduce((sum, t) => sum + t.total, 0);

    // Logic Daily Revenue (untuk Chart/Grafik)
    const revenueMap = transactions.reduce((acc, t) => {
      if (!t.date) return acc;
      try {
        const dateKey = new Date(t.date).toLocaleDateString("en-CA"); // YYYY-MM-DD
        if (!acc[dateKey]) acc[dateKey] = 0;
        acc[dateKey] += Number(t.total || 0);
      } catch (e) {
        console.warn("Invalid date format", e, t.date);
      }
      return acc;
    }, {});

    const dailyRevenue = Object.keys(revenueMap)
      .sort()
      .map((date) => ({
        date,
        label: new Date(date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }),
        total: revenueMap[date],
      }));

    return {
      totalProducts,
      totalStock,
      todayRevenue,
      dailyRevenue,
    };
  }, [products, transactions]);

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
    loadingProducts: loading,
    errorProducts: error,
    transactions,
    query,
    cart,
    filteredProducts,
    stats,
    setQuery,
    addToCart,
  };
};
