import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/admin/DashboardPage";

function App() {
  // landing | login | register | dashboard
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
        <LoginPage
          onBack={() => setCurrentPage("landing")}
          onLoginSuccess={() => setCurrentPage("dashboard")}
        />
      )}

      {currentPage === "register" && (
        <RegisterPage
          onBack={() => setCurrentPage("landing")}
          onLoginLink={() => setCurrentPage("login")}
        />
      )}

      {currentPage === "dashboard" && <DashboardPage />}
    </>
  );
}

export default App;
