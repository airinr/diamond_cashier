export const getPenjualan = async () => {
  const res = await fetch("/api/transactions", {
    method: "GET",
    headers: { 
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,   
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.detail?.[0]?.msg || result.message || "Gagal mengambil data transaksi"
    );
  }

  return result;
};

export const createTransaction = async (data) => {
  const res = await fetch("/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, 
    },
    body: JSON.stringify(data),
  });
  
  const result = await res.json();
  
  if (!res.ok) {
    throw new Error(
      result.detail?.[0]?.msg || result.message || "Gagal menambahkan transaksi"
    );
  }
  
  return result;
};

export const getPembelian = async () => {
  const res = await fetch("/api/purchases", {
    method: "GET",
    headers: { 
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,   
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.detail?.[0]?.msg || result.message || "Gagal mengambil data transaksi"
    );
  }

  return result;
}

export const createPurchase = async (data) => {
  const res = await fetch("/api/purchases", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, 
    },
    body: JSON.stringify(data),
  });
  
  const result = await res.json();
  
  if (!res.ok) {
    throw new Error(
      result.detail?.[0]?.msg || result.message || "Gagal menambahkan transaksi"
    );
  }
  
  return result;
};


export const predictPrice =  async (data) => {
  const res = await fetch("/api/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  const result = await res.json();
  
  if (!res.ok) {
    throw new Error(
      result.detail?.[0]?.msg || result.message || "Gagal melakukan prediksi harga"
    );
  }

  return result;
};