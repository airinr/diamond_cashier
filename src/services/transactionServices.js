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

export const getPembelian = async () => {
  
}

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

export const updateTransaction = async (id, data) => {

};

export const deleteTransaction = async (id) => {

};