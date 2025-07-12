import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROK_API_KEY; // your Groq API key

const extractionFn = {
  name: "extract_preferences",
  description: "Pulls lists of positive and negative preference keywords.",
  parameters: {
    type: "object",
    properties: {
      preferences: { type: "array", items: { type: "string" } },
      dislikes: { type: "array", items: { type: "string" } }
    },
    required: ["preferences", "dislikes"]
  }
};

app.post("/recommend", async (req, res) => {
  try {
    const { prompt = "", likes = [], dislikes = [] } = req.body;
    const seed = `${prompt}. Likes: ${likes.join(", ")}. Dislikes: ${dislikes.join(", ")}.`;

    // 1. Call Groq API with fetch directly
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",  // Groq model
        messages: [{ role: "user", content: seed }],
        functions: [extractionFn],
        function_call: { name: "extract_preferences" }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Grok API error:", error);
      return res.status(500).json({ error: "Grok API error" });
    }

    const gptResp = await response.json();

    const { preferences, dislikes: avoid } = JSON.parse(
      gptResp.choices[0].message.function_call.arguments
    );

    // 2. Search TMDB and RAWG as before
    const query = encodeURIComponent(preferences.slice(0, 5).join(" "));
    const [tmdb, rawg] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${query}&page=1`).then(r => r.json()),
      fetch(`https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${query}&page_size=5`).then(r => r.json())
    ]);

    // 3. Merge results as before
    const results = [
      ...(tmdb.results || []).slice(0, 5).map(item => ({
        id: item.id,
        title: item.title || item.name,
        type: item.media_type,
        img: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
        why: preferences.filter(p => (item.overview || "").toLowerCase().includes(p)).join(", ")
      })),
      ...(rawg.results || []).map(g => ({
        id: g.id,
        title: g.name,
        type: "game",
        img: g.background_image,
        why: preferences.filter(p => g.tags.some(t => t.name.toLowerCase().includes(p))).join(", ")
      }))
    ];

    res.json({ preferences, avoid, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(4000, () => console.log("API ready on http://localhost:4000"));
