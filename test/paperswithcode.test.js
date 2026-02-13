import assert from "node:assert/strict";
import { fetchPapersWithCodeTitles } from "../src/sources/paperswithcode.js";
import { createMockFetch } from "./helpers/mockFetch.js";

describe("Papers With Code source", () => {
  it("filters by published date and normalizes titles", async () => {
    const { restore } = createMockFetch(() => ({
      results: [
        { title: "  Paper   One ", published: "2024-03-03" },
        { title: "Paper Two", published: "2024-03-10" },
        { title: "Missing Date" },
      ],
    }));

    const start = new Date("2024-03-01T00:00:00Z");
    const end = new Date("2024-03-05T23:59:59Z");
    const titles = await fetchPapersWithCodeTitles(start, end);

    assert.deepEqual(titles, ["Paper One"]);

    restore();
  });
});