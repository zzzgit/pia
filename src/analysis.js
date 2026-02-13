const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "of",
  "on",
  "or",
  "that",
  "the",
  "their",
  "to",
  "with",
  "without",
  "via",
  "using",
  "use",
  "new",
  "open",
  "source",
  "model",
  "models",
  "llm",
  "llms",
  "ai",
  "agent",
  "agents",
]);

const extractKeywords = (titles) => {
  const counts = new Map();
  for (const title of titles) {
    const words = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    for (const w of words) {
      if (w.length < 3 || STOPWORDS.has(w)) continue;
      counts.set(w, (counts.get(w) || 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([keyword, count]) => ({ keyword, count }));
};

const summarizeWithLLM = async (titles, trends) => {
  await new Promise((r) => setTimeout(r, 120));
  return `Mock summary: ${titles.length} titles analyzed. Top themes include ${trends
    .slice(0, 5)
    .map((t) => t.keyword)
    .join(", ")}.`;
};

export { extractKeywords, summarizeWithLLM };
