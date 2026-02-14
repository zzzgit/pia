const USER_AGENT = 'pia-llm-trends/0.1 (+https://example.com)'

const toUnixSeconds = (date) => Math.floor(date.getTime() / 1000)

const fetchJson = async (url) => {
	const res = await fetch(url, {
		headers: {
			'user-agent': USER_AGENT,
			accept: 'application/json',
		},
		signal: AbortSignal.timeout(12000),
	})
	if (!res.ok) {
		throw new Error(`HTTP ${res.status} for ${url}`)
	}
	return res.json()
}

const withinRange = (date, start, end) => date >= start && date <= end

const normalizeTitle = (title) => title.replace(/\s+/g, ' ').trim()

export { toUnixSeconds, fetchJson, withinRange, normalizeTitle }
