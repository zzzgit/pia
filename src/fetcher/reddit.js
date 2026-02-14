import { fetchJson, normalizeTitle, withinRange } from '../utils.js'

const fetchByKeyword = (keyword, start, end) => {
	const url = new URL(
		'https://www.reddit.com/r/LocalLLaMA+MachineLearning+artificial/search.json'
	)
	url.searchParams.set('q', keyword)
	url.searchParams.set('restrict_sr', '1')
	url.searchParams.set('sort', 'new')
	url.searchParams.set('limit', '100')

	return fetchJson(url.toString()).then((data) => {
		const posts = data?.data?.children || []
		return posts
			.map((p) => p?.data)
			.filter(Boolean)
			.filter((p) => withinRange(new Date(p.created_utc * 1000), start, end))
			.map((p) => p.title)
			.filter(Boolean)
			.map(normalizeTitle)
	})
}

export { fetchByKeyword }
