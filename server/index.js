import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROK_API_KEY; // fixed typo here

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

    // Call Groq API
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [{ role: "user", content: seed }],
        functions: [extractionFn],
        function_call: { name: "extract_preferences" }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Groq API error:", error);
      return res.status(500).json({ error: "Groq API error" });
    }

    const gptResp = await response.json();

    // Safe parse of function call arguments
    let preferences = [];
    let avoid = [];
    try {
      if (
        gptResp.choices &&
        gptResp.choices[0].message &&
        gptResp.choices[0].message.function_call &&
        gptResp.choices[0].message.function_call.arguments
      ) {
        const args = JSON.parse(gptResp.choices[0].message.function_call.arguments);
        preferences = Array.isArray(args.preferences) ? args.preferences.map(p => p.toLowerCase()) : [];
        avoid = Array.isArray(args.dislikes) ? args.dislikes.map(d => d.toLowerCase()) : [];
      }
    } catch (e) {
      console.warn("Failed to parse Groq function_call arguments:", e);
    }

    // Fallback to prompt keywords if preferences empty
    if (preferences.length === 0) {
      preferences = prompt
        .toLowerCase()
        .split(/\W+/)
        .filter((w, i, arr) => w.length > 2 && arr.indexOf(w) === i)
        .slice(0, 5);
    }

    // Build search query
    const query = encodeURIComponent(preferences.slice(0, 5).join(" "));

    // Fetch TMDB and RAWG results
    const [tmdb, rawg] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${query}&page=1`).then(r => r.json()),
      fetch(`https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${query}&page_size=5`).then(r => r.json())
    ]);

    // Merge results with improved matching
    const results = [
      ...(tmdb.results || []).slice(0, 5).map(item => {
        const overview = (item.overview || "").toLowerCase();
        const matchedPrefs = preferences.filter(p => overview.includes(p));
        return {
          id: item.id,
          title: item.title || item.name,
          type: item.media_type,
          img: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
          why: matchedPrefs.join(", ")
        };
      }),
      ...(rawg.results || []).map(g => {
        const tagNames = (g.tags || []).map(t => t.name.toLowerCase());
        const matchedPrefs = preferences.filter(p => tagNames.some(tag => tag.includes(p)));
        return {
          id: g.id,
          title: g.name,
          type: "game",
          img: g.background_image,
          why: matchedPrefs.join(", ")
        };
      })
    ];

    res.json({ preferences, avoid, results });

    /*Debug logs
    console.log("Received prompt:", prompt);
    console.log("Extracted preferences:", preferences);
    console.log("Extracted dislikes:", avoid);
    console.log("Merged results:", results);
    */
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(4000, () => console.log("API ready on http://localhost:4000"));
