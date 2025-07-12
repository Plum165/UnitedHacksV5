// src/components/CommentSection.jsx
import React from "react";

export default function CommentSection({ comments }) {
  if (!comments.length) return null;

  return (
    <ul className="mt-4 space-y-2">
      {comments.map((c, idx) => (
        <li key={idx} className="border-l-4 border-grape-500 pl-2">
          <span className="font-semibold text-grape-300">
            {c.rating}★
          </span>{" "}
          {c.comment && <span className="text-gray-300">— {c.comment}</span>}
        </li>
      ))}
    </ul>
  );
}
