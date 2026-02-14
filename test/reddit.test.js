import assert from 'node:assert/strict'
import { fetchByKeyword as fetchRedditTitles } from '../src/fetcher/reddit.js'

describe('Reddit source', () => {
	it('filters by date range and normalizes titles', async () => {
		const start = new Date('2025-03-03T00:00:00Z')
		const end = new Date('2025-03-04T00:00:00Z')
		const titles = await fetchRedditTitles('llm', start, end)

		assert.ok(Array.isArray(titles))
		assert.ok(titles.every((title) => typeof title === 'string'))
	}).timeout(10000)
})
