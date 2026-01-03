const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = async () => {
  const res = await fetch("/api/products", {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.detail?.[0]?.msg || result.message || "Gagal mengambil data produk"
    );
  }

  return result;
};
