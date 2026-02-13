import assert from "node:assert/strict";
import { fetchTechCrunchTitles } from "../src/sources/techcrunch.js";
import { createMockFetch } from "./helpers/mockFetch.js";

describe("TechCrunch source", () => {
  it("aggregates and de-duplicates titles across search terms", async () => {
    const { calls, restore } = createMockFetch((url) => {
      const parsed = new URL(url);
      const term = parsed.searchParams.get("search");

      if (term === "openai") {
        return [
          { title: { rendered: "OpenAI <b>agent</b> update" } },
        ];
      }

      if (term === "llm") {
        return [
          { title: { rendered: "OpenAI <b>agent</b> update" } },
          { title: { rendered: "  LLM   launch " } },
        ];
      }

      return [];
    });

    const start = new Date("2024-04-01T00:00:00Z");
    const end = new Date("2024-04-07T00:00:00Z");
    const titles = await fetchTechCrunchTitles(start, end);

    assert.deepEqual(new Set(titles), new Set(["OpenAI agent update", "LLM launch"]));
    assert.ok(calls.length >= 1);

    restore();
  });
});