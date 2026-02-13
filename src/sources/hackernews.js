import { fetchJson, normalizeTitle, toUnixSeconds } from "../utils.js";

const fetchHackerNewsTitles = async (start, end) => {
  const startSec = toUnixSeconds(start);
  const endSec = toUnixSeconds(end);
  const url = new URL("https://hn.algolia.com/api/v1/search_by_date");
  url.searchParams.set("query", "LLM OR \"AI agent\" OR \"AI agents\" OR agentic");
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
