// src/components/RecommendationCard.jsx
import React, { useState } from "react";
import RatingForm from "./RatingForm";
import CommentSection from "./CommentSection";

export default function RecommendationCard({ item }) {
  const [reviews, setReviews] = useState([]);

  const addReview = ({ rating, comment }) =>
    setReviews([...reviews, { rating, comment }]);

  return (
    <article className="bg-surface rounded shadow-md p-4 flex flex-col">
      <h3 className="text-grape-300 font-semibold mb-1">{item.title}</h3>
      <p className="text-gray-400 flex-grow">{item.description}</p>

      {/* Rating & comment capture */}
      <RatingForm onSave={addReview} />

      {/* List existing comments */}
      <CommentSection comments={reviews} />
    </article>
  );
}
