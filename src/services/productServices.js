// --- GET PRODUCTS (Sesuai kode Anda) ---
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

// --- GET CATEGORIES (Untuk Dropdown) ---
export const getCategories = async () => {
  const res = await fetch("/api/categories", {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.detail?.[0]?.msg || result.message || "Gagal mengambil kategori"
    );
  }

  return result;
};

// --- CREATE PRODUCT (POST) ---
export const createProduct = async (data) => {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.detail?.[0]?.msg || result.message || "Gagal menambahkan produk"
    );
  }

  return result;
};

// --- UPDATE PRODUCT (PUT) ---
export const updateProduct = async (id, data) => {
  // Menggunakan URL: /api/products/{id}
  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.detail?.[0]?.msg || result.message || "Gagal mengupdate produk"
    );
  }

  return result;
};

// --- DELETE PRODUCT (DELETE) ---
export const deleteProduct = async (id) => {
  const res = await fetch(`/api/products/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.detail?.[0]?.msg || result.message || "Gagal menghapus produk"
    );
  }

  return result;
};

// --- KATEGORI CRUD ---

// 2. CREATE Category (POST)
export const createCategory = async (data) => {
  const res = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message || "Gagal membuat kategori");
  return result;
};

// 3. UPDATE Category (PUT)
// Note: oldCode diperlukan untuk URL, data baru ada di body
export const updateCategory = async (oldCode, data) => {
  const res = await fetch(`/api/categories/${oldCode}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message || "Gagal update kategori");
  return result;
};

// 4. DELETE Category (DELETE)
export const deleteCategory = async (code) => {
  const res = await fetch(`/api/categories/${code}`, {
    method: "DELETE",
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message || "Gagal menghapus kategori");
  return result;
};
