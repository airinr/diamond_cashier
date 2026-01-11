// src/utils/formatters.js
// import { clsx } from "clsx";
// import { twMerge } from "tailwind-merge";

// Formatter Rupiah
export const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    Number(n || 0)
  );

// Helper ClassName (opsional, jika tidak pakai library bisa pakai versi manual)
// Versi Manual (tanpa install library tambahan):
export const cn = (...classes) => classes.filter(Boolean).join(" ");

// Versi Library (jika install clsx & tailwind-merge):
// export function cn(...inputs) {
//   return twMerge(clsx(inputs));
// }
