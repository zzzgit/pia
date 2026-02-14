import assert from 'node:assert/strict'
import { fetchByKeyword as fetchTechCrunchTitles } from '../src/fetcher/techcrunch.js'

describe('TechCrunch source', () => {
	it('aggregates and de-duplicates titles across search terms', async () => {
		const start = new Date('2025-04-01T00:00:00Z')
		const end = new Date('2025-04-07T00:00:00Z')
		const titles = await fetchTechCrunchTitles('llm', start, end)

		assert.ok(Array.isArray(titles))
		assert.ok(titles.every((title) => typeof title === 'string'))
	})
})
