import { extractKeywords, summarizeWithLLM } from "./analysis.js";
import { fetchGitHubTitles } from "./sources/github.js";
import { fetchHackerNewsTitles } from "./sources/hackernews.js";
import { fetchPapersWithCodeTitles } from "./sources/paperswithcode.js";
import { fetchRedditTitles } from "./sources/reddit.js";
import { fetchTechCrunchTitles } from "./sources/techcrunch.js";
import { getLastWeekRange } from "./utils.js";

const main = async () => {
  const { start, end } = getLastWeekRange();

  const sources = [
    { name: "HackerNews", fetcher: () => fetchHackerNewsTitles(start, end) },
    { name: "GitHub", fetcher: () => fetchGitHubTitles(start, end) },
    { name: "Reddit", fetcher: () => fetchRedditTitles(start, end) },
    { name: "PapersWithCode", fetcher: () => fetchPapersWithCodeTitles(start, end) },
    { name: "TechCrunch", fetcher: () => fetchTechCrunchTitles(start, end) },
  ];

  const results = await Promise.allSettled(
    sources.map(async (s) => ({ name: s.name, titles: await s.fetcher() }))
  );

  const collected = [];
  for (const r of results) {
    if (r.status === "fulfilled") {
      collected.push(r.value);
    } else {
      collected.push({ name: "unknown", titles: [], error: r.reason?.message });
    }
  }

  const allTitles = collected.flatMap((c) => c.titles);
  // console.log(2222, allTitles)
  const trends = extractKeywords(allTitles);
  const summary = await summarizeWithLLM(allTitles, trends);

  const report = {
    range: {
      start: start.toISOString(),
      end: end.toISOString(),
    },
    sources: collected.map((c) => ({
      name: c.name,
      count: c.titles.length,
      error: c.error || null,
    })),
    trends,
    summary,
  };

  console.log(JSON.stringify(report, null, 2));
};

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
