# 🎬💡 TasteLoop

A hackathon proof‑of‑concept that lets people **discover movies, series, anime, and video‑games they’ll love** – powered by OpenAI for preference parsing and live content APIs (TMDB & RAWG).

> “Type *I like clever shark thrillers with no super‑powered heroes*, hit **Recommend**, and get instant cross‑media picks.”

---

## ✨ Features
- **Free‑form taste prompt** – Users can describe what they feel like watching/playing in natural language.
- **Likes / Dislikes rating loop** – Every thumbs‑up/down refines future suggestions in real‑time.
- **Cross‑media search** – Movies/TV from TMDB, games from RAWG, (stretch: anime from AniList).
- **Why this?** – Each card shows keywords that matched the user’s prompt so recommendations feel transparent.
- **Zero database required** – Works entirely from live APIs and in‑memory caching; persistence is optional.

---

## 🚀 Getting Started

### Prerequisites

- Node.js installed (version 16+ recommended)
- API keys for:
  - [OpenAI](https://openai.com/api) (for preference parsing)
  - [TMDB](https://www.themoviedb.org/documentation/api) (for movies and TV shows)
  - [RAWG](https://rawg.io/apidocs) (for games)

### Installation & Running

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/tasteloop.git
   cd tasteloop
  npm install
  cd client
  npm install  
  cd ..
   ```

Add your API keys to environment variables (e.g., .env file):
```
OPENAI_API_KEY=your_openai_key
TMDB_API_KEY=your_tmdb_key
RAWG_API_KEY=your_rawg_key
```
Run the server:
```
node index.js
```

In a new terminal, run the client:

```
cd client
npm run dev

Open your browser at http://localhost:3000 (or the port your client runs on) to use TasteLoop.

## 🏗 Project Structure
index.js — Main server entry point

client/ — Frontend React app

services/ — API integration and business logic

components/ — React UI components

utils/ — Utility functions

## How it Works
User enters a natural language prompt describing what they want to watch or play.

The backend uses OpenAI’s API to parse user preferences and extract relevant keywords.

Live APIs from TMDB (movies/TV) and RAWG (games) fetch matching content based on those keywords.

Recommendations are shown to the user with matched keywords highlighted.

Users can rate items with thumbs-up or thumbs-down, which immediately refines future recommendations in the session.



