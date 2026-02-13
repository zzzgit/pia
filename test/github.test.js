import assert from "node:assert/strict";
import { fetchGitHubTitles } from "../src/sources/github.js";
import { createMockFetch } from "./helpers/mockFetch.js";

describe("GitHub source", () => {
  it("builds query and normalizes titles", async () => {
    let capturedUrl;
    let capturedOptions;
    const { restore } = createMockFetch((url, options) => {
      capturedUrl = url;
      capturedOptions = options;
      return {
        items: [
          { full_name: "  Foo   Bar " },
          { full_name: "Baz" },
          { full_name: null },
        ],
      };
    });

    const start = new Date(Date.UTC(2024, 0, 1));
    const end = new Date(Date.UTC(2024, 0, 7));
    const titles = await fetchGitHubTitles(start, end);

    assert.deepEqual(titles, ["Foo Bar", "Baz"]);
    assert.ok(capturedUrl);

    const parsed = new URL(capturedUrl);
    assert.equal(parsed.origin + parsed.pathname, "https://api.github.com/search/repositories");
    const q = parsed.searchParams.get("q");
    assert.ok(q.includes("created:2024-01-01..2024-01-07"));
    assert.equal(parsed.searchParams.get("sort"), "stars");
    assert.equal(parsed.searchParams.get("order"), "desc");
    assert.equal(parsed.searchParams.get("per_page"), "50");

    assert.equal(capturedOptions?.headers?.["user-agent"], "pia-llm-trends/0.1 (+https://example.com)");
    assert.equal(capturedOptions?.headers?.accept, "application/json");
    assert.ok(capturedOptions?.signal);

    restore();
  });
});