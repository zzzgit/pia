import { fetchJson, normalizeTitle, toUnixSeconds } from '../utils.js'

const fetchByKeyword = (keyword, start, end) => {
	const startSec = toUnixSeconds(start)
	const endSec = toUnixSeconds(end)
	const url = new URL('https://hn.algolia.com/api/v1/search_by_date')
	url.searchParams.set('query', keyword)
	url.searchParams.set('tags', 'story')
	url.searchParams.set('numericFilters', `created_at_i>=${startSec},created_at_i<=${endSec}`)
	url.searchParams.set('hitsPerPage', '100')

	return fetchJson(url.toString()).then((data) =>
		(data.hits || [])
			.map((hit) => hit.title)
			.filter(Boolean)
			.map(normalizeTitle)
	)
}

export { fetchByKeyword }
