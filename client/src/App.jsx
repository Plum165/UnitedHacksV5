import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import RecommendationList from './components/RecommendationList';

import './index.css';

export default function App() {
  const [recommendations, setRecommendations] = useState([]);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-grape-400 to-grape-600 text-center mb-6">
  🎬 Omni‑Recommend
</h1>

      <SearchBar setRecommendations={setRecommendations} />
      <RecommendationList items={recommendations} />
    </main>
  );
}
