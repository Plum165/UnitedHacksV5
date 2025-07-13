import React, { useState } from "react";
import RatingForm from "./RatingForm";
import CommentSection from "./CommentSection";

export default function RecommendationCard({ item, onSave }) {
  const [reviews, setReviews] = useState([]);

  const addReview = ({ rating, comment }) =>
    setReviews([...reviews, { rating, comment }]);

  return (
    <article className="bg-surface rounded shadow-md p-4 flex flex-col">
      {item.img && (
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-48 object-cover rounded mb-2"
        />
      )}

      <h3 className="text-grape-300 font-semibold mb-1">{item.title}</h3>
      <p className="text-gray-400 italic mb-2">{item.type}</p>
      <p className="text-gray-400 flex-grow mb-4">{item.description || item.overview}</p>

      <button
        className="mb-4 bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1 rounded"
        onClick={() => onSave && onSave(item)}
      >
        {item.type === "game" ? "Add to Game List" : "Add to Watchlist"}
      </button>

      {/* Rating & comment capture */}
      <RatingForm onSave={addReview} />

      {/* List existing comments */}
      <CommentSection comments={reviews} />
    </article>
  );
}
