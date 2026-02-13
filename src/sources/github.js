import { fetchJson, formatDateUTC, normalizeTitle } from "../utils.js";

const fetchGitHubTitles = async (start, end) => {
  const startDate = formatDateUTC(start);
  const endDate = formatDateUTC(end);
  const q = [
    "(llm OR \"ai agent\" OR \"ai agents\" OR agentic)",
    "in:name,description,readme",
    `created:${startDate}..${endDate}`,
  ].join(" ");
  const url = new URL("https://api.github.com/search/repositories");
  url.searchParams.set("q", q);
  url.searchParams.set("sort", "stars");
  url.searchParams.set("order", "desc");
  url.searchParams.set("per_page", "50");

  const data = await fetchJson(url.toString());
  return (data.items || [])
    .map((repo) => repo.full_name)
    .filter(Boolean)
    .map(normalizeTitle);
};

export { fetchGitHubTitles };
