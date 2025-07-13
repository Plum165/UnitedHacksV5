import React, { useState, useEffect } from "react";

// Components
import SearchBar from "./components/SearchBar";
import RecommendationList from "./components/RecommendationList";
import Watchlist from "./components/Watchlist";
import GameList from "./components/GameList";

const load = (key, fallback) =>
  JSON.parse(localStorage.getItem(key)) ?? fallback;

const save = (key, val) =>
  localStorage.setItem(key, JSON.stringify(val));

export default function App() {
  const [results, setResults] = useState([]);
  const [watchlist, setWatchlist] = useState(() => load("watchlist", []));
  const [gamelist, setGamelist] = useState(() => load("gamelist", []));
  const [tab, setTab] = useState("search"); // 'search' | 'watch' | 'games'

  useEffect(() => save("watchlist", watchlist), [watchlist]);
  useEffect(() => save("gamelist", gamelist), [gamelist]);

  // Deduplicate helper
  const addUnique = (list, item, setList) => {
    if (!list.some(i => i.id === item.id)) {
      setList([...list, item]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 text-gray-100 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-center">TasteLoop</h1>
  <p className="text-base text-gray-300 text-center">Looping your likes into perfect picks.<br /></p>

      {/* Tab navigation */}
      <div className="flex gap-4 justify-center mb-6">
        {["search", "watch", "games"].map(t => (
          <button
            key={t}
            className={`px-4 py-2 rounded ${
              tab === t ? "bg-purple-700" : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setTab(t)}
          >
            {t === "search"
              ? "🔍 Search"
              : t === "watch"
              ? "🎬 Watchlist"
              : "🎮 Game List"}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "search" && (
        <>
          <SearchBar setRecommendations={setResults} />
          <RecommendationList
            items={results}
            addToWatch={item => addUnique(watchlist, item, setWatchlist)}
            addToGames={item => addUnique(gamelist, item, setGamelist)}
          />
        </>
      )}

      {tab === "watch" && (
        <Watchlist
          items={watchlist}
          removeItem={id => setWatchlist(watchlist.filter(i => i.id !== id))}
        />
      )}

      {tab === "games" && (
        <GameList
          items={gamelist}
          removeItem={id => setGamelist(gamelist.filter(i => i.id !== id))}
        />
      )}
    </div>
  );
}
