import { useState } from "react";

export default function SearchBar({ setRecommendations }) {
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!input.trim()) return;

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
      // 🔑 the backend sends { preferences, avoid, **results** }
      setRecommendations(Array.isArray(data.results) ? data.results : []);
    } catch (err) {
      console.error(err);
      alert(err.message || "Request failed");
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 justify-center mb-6 w-full max-w-xl">
      <input
        className="flex-1 bg-surface border border-grape-700 focus:border-grape-500 focus:ring-grape-500
                   text-gray-200 placeholder-purple-500 rounded px-3 py-2"
        type="text"
        value={input}
        placeholder="Describe something you like..."
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      <button
        className="bg-grape-500 hover:bg-grape-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? "Loading…" : "Search"}
      </button>
    </div>
  );
}
