import React from "react";

export default function GameList({ items, removeItem }) {
  if (!items.length) return <p className="text-center">Game list empty.</p>;

  return (
    <div className="grid gap-4 mt-6">
      {items.map(g => (
        <div
          key={g.id}
          className="flex items-center gap-4 bg-gray-800 p-3 rounded"
        >
          {g.img && (
            <img src={g.img} alt={g.title} className="w-12 rounded object-cover" />
          )}
          <span className="flex-1">{g.title}</span>
          <button
            className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
            onClick={() => removeItem(g.id)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
