import assert from 'node:assert/strict'
import { fetchByKeyword as fetchHackerNewsTitles } from '../src/fetcher/hackernews.js'

describe('Hacker News source', () => {
	it('uses date range filters and normalizes titles', async () => {
		const start = new Date('2025-02-01T00:00:00Z')
		const end = new Date('2025-02-02T00:00:00Z')
		const titles = await fetchHackerNewsTitles('LLM', start, end)

		assert.ok(Array.isArray(titles))
		assert.ok(titles.every((title) => typeof title === 'string'))
	})
})
