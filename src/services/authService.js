// Simulasi login ke backend (Dummy)
export const loginUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    // Ceritanya loading 1.5 detik
    setTimeout(() => {
      // Hardcode username & password untuk tes
      if (email === "admin@diamond.com" && password === "admin123") {
        resolve({
          status: "success",
          data: {
            id: 1,
            name: "Manager Toko",
            token: "dummy-token-jwt-12345",
            role: "admin",
          },
        });
      } else {
        reject(new Error("Email atau password tidak terdaftar."));
      }
    }, 1500);
  });
};

// Simulasi Register
export const registerUser = async (name, email, password) => {
  return new Promise((resolve) => {
    // Simulasi loading 1.5 detik
    setTimeout(() => {
      // Kita anggap register selalu berhasil untuk dummy ini
      resolve({
        status: "success",
        message: "Akun berhasil dibuat",
        data: {
          name: name,
          email: email,
          password: password,
          role: "staff", // Default role
        },
      });
    }, 1500);
  });
};
