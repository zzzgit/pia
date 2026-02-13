import assert from "node:assert/strict";
import { fetchHackerNewsTitles } from "../src/sources/hackernews.js";
import { createMockFetch } from "./helpers/mockFetch.js";

describe("Hacker News source", () => {
  it("uses date range filters and normalizes titles", async () => {
    let capturedUrl;
    const { restore } = createMockFetch((url) => {
      capturedUrl = url;
      return {
        hits: [
          { title: "  LLM   tools " },
          { title: "Agents" },
          { title: null },
        ],
      };
    });

    const start = new Date("2024-02-01T00:00:00Z");
    const end = new Date("2024-02-02T00:00:00Z");
    const titles = await fetchHackerNewsTitles(start, end);

    assert.deepEqual(titles, ["LLM tools", "Agents"]);
    const parsed = new URL(capturedUrl);
    assert.equal(parsed.origin + parsed.pathname, "https://hn.algolia.com/api/v1/search_by_date");
    assert.equal(parsed.searchParams.get("tags"), "story");
    assert.equal(parsed.searchParams.get("hitsPerPage"), "100");

    const numericFilters = parsed.searchParams.get("numericFilters");
    assert.ok(numericFilters.includes("created_at_i>="));
    assert.ok(numericFilters.includes("created_at_i<="));

    restore();
  });
});