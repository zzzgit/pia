import { fetchJson, normalizeTitle, withinRange } from "../utils.js";

const fetchPapersWithCodeTitles = async (start, end) => {
  const url = new URL("https://paperswithcode.com/api/v1/papers/");
  url.searchParams.set("q", "llm OR \"ai agent\" OR agentic");
  url.searchParams.set("page", "1");
  url.searchParams.set("items_per_page", "100");

  const data = await fetchJson(url.toString());
  const results = data?.results || [];

  return results
    .filter((p) => p?.published)
    .filter((p) => withinRange(new Date(p.published), start, end))
    .map((p) => p.title)
    .filter(Boolean)
    .map(normalizeTitle);
};

export { fetchPapersWithCodeTitles };
