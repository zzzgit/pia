const USER_AGENT = "pia-llm-trends/0.1 (+https://example.com)";

const toUnixSeconds = (date) => Math.floor(date.getTime() / 1000);

const formatDateUTC = (date) => {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getLastWeekRange = (now = new Date()) => {
  const today = new Date(now);
  const day = today.getDay(); // 0=Sun,1=Mon,...
  const diffToMonday = (day + 6) % 7; // days since Monday

  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - diffToMonday);
  currentMonday.setHours(0, 0, 0, 0);

  const lastMonday = new Date(currentMonday);
  lastMonday.setDate(currentMonday.getDate() - 7);
  lastMonday.setHours(0, 0, 0, 0);

  const lastSunday = new Date(currentMonday);
  lastSunday.setDate(currentMonday.getDate() - 1);
  lastSunday.setHours(23, 59, 59, 999);

  return {
    start: lastMonday,
    end: lastSunday,
  };
};

const fetchJson = async (url) => {
  const res = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "accept": "application/json",
    },
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.json();
};

const withinRange = (date, start, end) => date >= start && date <= end;

const normalizeTitle = (title) => title.replace(/\s+/g, " ").trim();

export {
  USER_AGENT,
  toUnixSeconds,
  formatDateUTC,
  getLastWeekRange,
  fetchJson,
  withinRange,
  normalizeTitle,
};
