// anilist.js - helpers to query AniList (GraphQL)
const fetch = require('node-fetch');

async function rawQuery(query, variables) {
  const res = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  });
  return res.json();
}

const SEARCH_QUERY = `
query ($search: String, $perPage: Int) {
  Page(perPage: $perPage) {
    media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
      id
      title { romaji english native }
      coverImage { large medium color }
      status
      nextAiringEpisode { episode airingAt timeUntilAiring }
    }
  }
}
`;

const BY_ID_QUERY = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id
    title { romaji english native }
    coverImage { large medium color }
    status
    nextAiringEpisode { episode airingAt timeUntilAiring }
  }
}
`;

async function searchAniList(q, perPage = 10) {
  const json = await rawQuery(SEARCH_QUERY, { search: q, perPage });
  return (json?.data?.Page?.media) || [];
}

async function getById(id) {
  const json = await rawQuery(BY_ID_QUERY, { id });
  return json?.data?.Media || null;
}

module.exports = { searchAniList, getById };
