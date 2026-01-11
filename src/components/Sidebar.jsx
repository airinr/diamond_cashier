import React from "react";
import { LayoutDashboard, Package, Receipt, Users, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ active = "dashboard", onLogout }) => {
  const navigate = useNavigate();

  const menu = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard", // sesuai App.jsx
    },
    {
      key: "product",
      label: "Produk",
      icon: Package,
      path: "/products",
    },
    {
      key: "transaction",
      label: "Transaksi",
      icon: Receipt,
      path: "/admin/transactions", // disiapkan
    },
    {
      key: "user",
      label: "User",
      icon: Users,
      path: "/admin/users", // disiapkan
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-black text-yellow-400">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-yellow-400/30">
        <h1 className="text-xl font-bold tracking-wide">
          DIAMOND<span className="text-white">KASIR</span>
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-1 px-4 py-6">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;

          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition
                ${
                  isActive
                    ? "bg-yellow-400 text-black"
                    : "text-yellow-300 hover:bg-yellow-400/10"
                }
              `}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 w-full px-4 py-6">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-yellow-300 hover:bg-red-500 hover:text-white transition"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
