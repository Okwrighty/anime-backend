import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/check", async (req, res) => {
    try {
        const animeName = req.query.anime;
        if (!animeName) {
            return res.status(400).json({ error: "Missing ?anime=" });
        }

        const query = `
        query ($search: String) {
          Page(perPage: 1) {
            media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
              title { romaji }
              nextAiringEpisode { episode timeUntilAiring }
            }
          }
        }`;

        const variables = { search: animeName };

        const response = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, variables })
        });

        const json = await response.json();

        const media = json.data.Page.media[0];
        res.json({ media });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error talking to AniList." });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
