import { fetchJson, normalizeTitle } from "../utils.js";

const SEARCH_TERMS = ["llm", "large language model", "ai agent", "agentic", "openai"];

const stripHtml = (html) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const fetchByTerm = async (term, start, end) => {
  const url = new URL("https://techcrunch.com/wp-json/wp/v2/posts");
  url.searchParams.set("per_page", "100");
  url.searchParams.set("after", start.toISOString());
  url.searchParams.set("before", end.toISOString());
  url.searchParams.set("search", term);

  const data = await fetchJson(url.toString());
  return (data || [])
    .map((p) => p?.title?.rendered)
    .filter(Boolean)
    .map(stripHtml)
    .map(normalizeTitle);
};

const fetchTechCrunchTitles = async (start, end) => {
  const results = await Promise.allSettled(
    SEARCH_TERMS.map((term) => fetchByTerm(term, start, end))
  );

  const titles = [];
  for (const r of results) {
    if (r.status === "fulfilled") {
      titles.push(...r.value);
    }
  }

  return [...new Set(titles)];
};

export { fetchTechCrunchTitles };
