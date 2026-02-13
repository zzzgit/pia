import { fetchJson, normalizeTitle, withinRange } from "../utils.js";

const fetchRedditTitles = async (start, end) => {
  const url = new URL("https://www.reddit.com/r/LocalLLaMA+MachineLearning+artificial/top.json");
  url.searchParams.set("t", "week");
  url.searchParams.set("limit", "100");

  const data = await fetchJson(url.toString());
  const posts = data?.data?.children || [];

  return posts
    .map((p) => p?.data)
    .filter(Boolean)
    .filter((p) => withinRange(new Date(p.created_utc * 1000), start, end))
    .map((p) => p.title)
    .filter(Boolean)
    .map(normalizeTitle);
};

export { fetchRedditTitles };
