import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// AniList API proxy
app.get("/check", async (req, res) => {
  const query = `
    query ($search: String) {
      Media(search: $search, type: ANIME) {
        title {
          romaji
        }
        nextAiringEpisode {
          episode
          timeUntilAiring
        }
      }
    }
  `;

  const variables = { search: req.query.name };

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "server_error" });
  }
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
