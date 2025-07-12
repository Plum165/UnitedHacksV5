// src/components/RatingForm.jsx
import React, { useState } from "react";

export default function RatingForm({ onSave }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return; // require at least 1 star
    onSave({ rating, comment });
    setRating(0);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      {/* ★ star selector */}
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setRating(num)}
            className={`
              text-2xl transition
              ${num <= rating ? "text-grape-400" : "text-gray-500"}
              hover:text-grape-300
            `}
          >
            ★
          </button>
        ))}
      </div>

      {/* comment box */}
      <textarea
        rows={2}
        placeholder="Optional comment…"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full bg-surface border border-gray-700 rounded p-2 text-sm text-gray-200 placeholder-gray-500"
      />

      <button
        type="submit"
        className="mt-2 bg-grape-500 hover:bg-grape-600 text-white px-3 py-1 rounded text-sm"
      >
        Submit
      </button>
    </form>
  );
}
