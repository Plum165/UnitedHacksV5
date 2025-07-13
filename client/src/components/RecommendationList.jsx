import React from "react";
import RecommendationCard from "./RecommendationCard";

export default function RecommendationList({ items, addToWatch, addToGames }) {
  
  if (!Array.isArray(items) || items.length === 0) {
    return <p className="text-center">No recommendations yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => (
        <RecommendationCard
          key={`${item.type}-${item.id}`}
          item={item}
          onSave={item.type === "game" ? addToGames : addToWatch}
        />
      ))}
    </div>
  );
}
