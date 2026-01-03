// src/components/cards/StatCard.jsx
import React from "react";

const StatCard = ({ icon: Icon, title, value, subtitle }) => {
  if (!Icon) return null; // safety guard

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
