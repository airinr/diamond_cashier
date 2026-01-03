import React from "react";
import { ShoppingCart } from "lucide-react";

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    Number(n || 0)
  );

const cn = (...cls) => cls.filter(Boolean).join(" ");

const ProductCard = ({ p, onAdd }) => {
  const lowStock = p?.stock <= 10;

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative h-36 w-full overflow-hidden bg-slate-100">
        <img
          src={p?.image}
          alt={p?.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-slate-700">
          {p?.category}
        </div>

        <div
          className={cn(
            "absolute right-3 top-3 rounded-full px-2 py-1 text-xs font-semibold",
            lowStock
              ? "bg-rose-100 text-rose-700"
              : "bg-emerald-100 text-emerald-700"
          )}
        >
          Stok: {p?.stock}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">{p?.id}</p>
            <h3 className="text-base font-semibold text-slate-900">
              {p?.name}
            </h3>
          </div>

          <div className="text-right">
            <p className="text-sm text-slate-500">Harga</p>
            <p className="font-semibold text-slate-900">{rupiah(p?.price)}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onAdd?.(p)}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:scale-[0.99]"
        >
          <ShoppingCart className="h-4 w-4" />
          Detail
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
