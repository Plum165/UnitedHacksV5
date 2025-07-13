import React from "react";

export default function Watchlist({ items, removeItem }) {
  if (!items.length) return <p className="text-center">Watchlist empty.</p>;

  return (
    <div className="grid gap-4 mt-6">
      {items.map(m => (
        <div
          key={m.id}
          className="flex items-center gap-4 bg-gray-800 p-3 rounded"
        >
          {m.img && (
            <img src={m.img} alt={m.title} className="w-12 rounded object-cover" />
          )}
          <span className="flex-1">{m.title}</span>
          <button
            className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
            onClick={() => removeItem(m.id)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
