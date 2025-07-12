import React from "react";
import RecommendationCard from "./RecommendationCard";

export default function RecommendationList({ items }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <p className="text-center">No recommendations yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, idx) => (
        <RecommendationCard key={idx} item={item} />
      ))}
    </div>
  );
}
