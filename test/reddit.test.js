import assert from "node:assert/strict";
import { fetchRedditTitles } from "../src/sources/reddit.js";
import { createMockFetch } from "./helpers/mockFetch.js";

describe("Reddit source", () => {
  it("filters by date range and normalizes titles", async () => {
    const { restore } = createMockFetch(() => ({
      data: {
        children: [
          { data: { title: "  LLM   post ", created_utc: 1709500000 } },
          { data: { title: "Old post", created_utc: 1700000000 } },
          { data: null },
        ],
      },
    }));

    const start = new Date("2024-03-03T00:00:00Z");
    const end = new Date("2024-03-04T00:00:00Z");
    const titles = await fetchRedditTitles(start, end);

    assert.deepEqual(titles, ["LLM post"]);

    restore();
  });
});