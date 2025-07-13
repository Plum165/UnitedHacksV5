import React, { useState } from "react";

export default function SearchBar({ setRecommendations }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    console.log("Sending prompt:", input);
    if (!input.trim()) return;
    console.log("Sending prompt:", input);

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        const { error } = await response.json().catch(() => ({ error: "Server error" }));
        throw new Error(error);
      }

      const data = await response.json();
      setRecommendations(Array.isArray(data.results) ? data.results : []);
    } catch (err) {
      console.error("Search error:", err);
      alert(err.message || "Request failed");
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="flex gap-2 justify-center mb-6 w-full max-w-xl mx-auto">
    <input
      className="flex-1 bg-gray-800 border border-purple-700 focus:border-purple-500 focus:ring-purple-500
                 text-gray-200 placeholder-purple-400 rounded px-3 py-2"
      type="text"
      value={input}
      placeholder="Describe something you like..."
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
    />
    <button
      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50"
      onClick={handleSearch}
      disabled={loading}
    >
      {loading ? 'Loading…' : 'Search'}
    </button>
  </div>
);

}
