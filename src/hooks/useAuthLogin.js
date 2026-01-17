import { useState } from "react";
import { loginUser } from "../services/authService";

export function useAuthLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const login = async (username, password) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await loginUser(username, password);
      localStorage.setItem("token", res.access_token);
      return res;
    } catch (err) {
      const msg = err?.message || "Login gagal. Coba lagi.";
      setErrorMessage(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, errorMessage, setErrorMessage };
}
