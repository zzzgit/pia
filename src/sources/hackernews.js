import { fetchJson, normalizeTitle, toUnixSeconds } from "../utils.js";

const fetchHackerNewsTitles = async (start, end) => {
  const startSec = toUnixSeconds(start);
  const endSec = toUnixSeconds(end);
  const url = new URL("https://hn.algolia.com/api/v1/search_by_date");
  url.searchParams.set("query", "LLM");
  url.searchParams.set("tags", "story");
  url.searchParams.set("numericFilters", `created_at_i>=${startSec},created_at_i<=${endSec}`);
  url.searchParams.set("hitsPerPage", "100");

  const data = await fetchJson(url.toString());
  return (data.hits || [])
    .map((hit) => hit.title)
    .filter(Boolean)
    .map(normalizeTitle);
};

export { fetchHackerNewsTitles };

// now test fetchHackerNewsTitles

const testFetchHackerNewsTitles = async () => {
 

  const start = new Date("2024-03-03T00:00:00Z");
  const end = new Date("2024-03-04T00:00:00Z");
  const titles = await fetchHackerNewsTitles(start, end);

  console.log("Fetched Hacker News titles:", titles);
};

testFetchHackerNewsTitles()