import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  // State halaman: 'landing' | 'login' | 'register'
  const [currentPage, setCurrentPage] = useState("landing");

  return (
    <>
      {currentPage === "landing" && (
        <LandingPage
          onLoginClick={() => setCurrentPage("login")}
          onRegisterClick={() => setCurrentPage("register")}
        />
      )}

      {currentPage === "login" && (
        <LoginPage onBack={() => setCurrentPage("landing")} />
      )}

      {currentPage === "register" && (
        <RegisterPage
          onBack={() => setCurrentPage("landing")}
          onLoginLink={() => setCurrentPage("login")}
        />
      )}
    </>
  );
}

export default App;
