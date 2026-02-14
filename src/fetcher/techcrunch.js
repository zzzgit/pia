import { fetchJson, normalizeTitle } from '../utils.js'

const fetchByKeyword = (keyword, start, end) => {
	const url = new URL('https://techcrunch.com/wp-json/wp/v2/posts')
	url.searchParams.set('per_page', '100')
	url.searchParams.set('after', start.toISOString())
	url.searchParams.set('before', end.toISOString())
	url.searchParams.set('search', keyword)

	return fetchJson(url.toString()).then((data) =>
		(data || [])
			.map((p) => p?.title?.rendered)
			.filter(Boolean)
			.map((title) =>
				title
					.replace(/<[^>]*>/g, ' ')
					.replace(/\s+/g, ' ')
					.trim()
			)
			.map(normalizeTitle)
	)
}
export { fetchByKeyword }
