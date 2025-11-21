import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/check", async (req, res) => {
    try {
        const title = req.query.title;
        if (!title) {
            return res.status(400).json({ error: "Missing title parameter" });
        }

        const query = `
        query ($search: String) {
            Media(search: $search, type: ANIME) {
                title { romaji }
                nextAiringEpisode {
                    airingAt
                    episode
                }
            }
        }`;

        const response = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, variables: { search: title } }),
        });

        const data = await response.json();
        res.json(data);

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Anime Tracker API running on port " + PORT));
