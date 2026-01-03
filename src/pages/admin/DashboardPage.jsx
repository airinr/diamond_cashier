/* eslint-disable no-unused-vars */
import React, { useMemo, useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  Package,
  Receipt,
  TrendingUp,
} from "lucide-react";
import Sidebar from "../../components/sidebar";
import StatCard from "../../components/StatCard";
import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../services/productServices";

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    Number(n || 0)
  );

const cn = (...cls) => cls.filter(Boolean).join(" ");

const sampleProducts = [
  {
    id: "P001",
    name: "Indomie Goreng",
    category: "Makanan",
    price: 3500,
    stock: 120,
    image:
      "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "P002",
    name: "Teh Botol 350ml",
    category: "Minuman",
    price: 5000,
    stock: 80,
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "P003",
    name: "Sabun Mandi",
    category: "Kebutuhan",
    price: 9000,
    stock: 40,
    image:
      "https://images.unsplash.com/photo-1615486364462-ef6363adf8c2?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "P004",
    name: "Sikat Gigi",
    category: "Kebutuhan",
    price: 7000,
    stock: 25,
    image:
      "https://images.unsplash.com/photo-1588776814546-1f2c5a8f9499?q=80&w=900&auto=format&fit=crop",
  },
];

const sampleTransactions = [
  {
    id: "TRX-0001",
    date: "2026-01-03 07:10",
    customer: "Walk-in",
    items: 3,
    total: 18500,
    status: "PAID",
    method: "CASH",
  },
  {
    id: "TRX-0002",
    date: "2026-01-03 06:58",
    customer: "Airin",
    items: 6,
    total: 54000,
    status: "PAID",
    method: "QRIS",
  },
  {
    id: "TRX-0003",
    date: "2026-01-02 21:12",
    customer: "Walk-in",
    items: 1,
    total: 5000,
    status: "PAID",
    method: "CASH",
  },
];

// ✅ mapper: backend -> UI
const mapProductFromApi = (x) => ({
  id: String(x?.id_produk ?? ""),
  name: x?.nama_produk ?? "-",
  category: x?.kode_kategori ?? "-",
  price: Number(x?.harga ?? 0),
  stock: Number(x?.stok ?? 0),
  // kalau backend belum punya field gambar, pakai default image
  image:
    "https://images.unsplash.com/photo-1664044020180-b75bfddf9776?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
});

function StatusPill({ status }) {
  const map = {
    PAID: "bg-emerald-100 text-emerald-700",
    PENDING: "bg-amber-100 text-amber-700",
    CANCELLED: "bg-rose-100 text-rose-700",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-1 text-xs font-semibold",
        map[status] || "bg-slate-100 text-slate-700"
      )}
    >
      {status}
    </span>
  );
}

export default function Dashboard() {
  const [products, setProducts] = useState(sampleProducts);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorProducts, setErrorProducts] = useState("");

  const [transactions] = useState(sampleTransactions);

  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);

  // ✅ fetch /products saat halaman dibuka
  useEffect(() => {
    let alive = true;

    (async () => {
      setLoadingProducts(true);
      setErrorProducts("");

      try {
        const data = await getProducts();

        // data bisa array langsung atau {data: array}
        const list = Array.isArray(data) ? data : data?.data;

        if (!alive) return;

        if (Array.isArray(list) && list.length > 0) {
          // ✅ mapping sesuai backend
          const mapped = list.map(mapProductFromApi);
          setProducts(mapped);
        } else {
          setProducts(sampleProducts);
        }
      } catch (err) {
        if (!alive) return;
        setErrorProducts(err?.message || "Gagal mengambil produk");
        setProducts(sampleProducts);
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

  const cartTotal = useMemo(
    () => cart.reduce((sum, it) => sum + it.price * it.qty, 0),
    [cart]
  );

  const totalProducts = products.length;
  const totalStock = products.reduce(
    (sum, p) => sum + (Number(p.stock) || 0),
    0
  );

  const todayRevenue = transactions
    .filter((t) => t.date.startsWith("2026-01-03"))
    .reduce((sum, t) => sum + (Number(t.total) || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar active="dashboard" />

      <div className="ml-52 min-h-screen">
        {/* Topbar */}
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Dashboard Kasir
              </h1>
              <p className="text-sm text-slate-500">
                Ringkasan produk & transaksi terbaru
              </p>
            </div>

            <div className="flex w-full max-w-md items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari produk (nama / kategori / ID)..."
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Package}
              title="Total Produk"
              value={totalProducts}
              subtitle="Jumlah SKU terdaftar"
            />
            <StatCard
              icon={TrendingUp}
              title="Total Stok"
              value={totalStock}
              subtitle="Akumulasi stok semua produk"
            />
            <StatCard
              icon={Receipt}
              title="Transaksi"
              value={transactions.length}
              subtitle="Riwayat transaksi"
            />
          </div>

          {/* Content */}
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            {/* Products */}
            <div>
              <div className="mb-3 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Produk
                  </h2>
                  <p className="text-sm text-slate-500">Produk Diamond</p>

                  {loadingProducts ? (
                    <p className="mt-1 text-sm text-slate-500">
                      Memuat produk...
                    </p>
                  ) : errorProducts ? (
                    <p className="mt-1 text-sm text-rose-600">
                      {errorProducts}
                    </p>
                  ) : null}
                </div>

                <div className="text-sm text-slate-500">
                  Menampilkan:{" "}
                  <span className="font-semibold text-slate-900">
                    {filteredProducts.length}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} p={p} onAdd={addToCart} />
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className="grid gap-6">
              {/* Transactions */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">
                    Transaksi Terbaru
                  </h3>
                  <p className="text-sm text-slate-500">
                    Hari ini:{" "}
                    <span className="font-semibold text-slate-900">
                      {rupiah(todayRevenue)}
                    </span>
                  </p>
                </div>

                <div className="mt-3 space-y-3">
                  {transactions.map((t) => (
                    <div
                      key={t.id}
                      className="rounded-xl border border-slate-200 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {t.id}
                          </p>
                          <p className="text-xs text-slate-500">
                            {t.date} • {t.customer} • {t.items} item •{" "}
                            {t.method}
                          </p>
                        </div>
                        <div className="text-right">
                          <StatusPill status={t.status} />
                          <p className="mt-1 text-sm font-bold text-slate-900">
                            {rupiah(t.total)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 active:scale-[0.99]"
                  type="button"
                >
                  Lihat Semua Transaksi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end content */}
    </div>
  );
}
