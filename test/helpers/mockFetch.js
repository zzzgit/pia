const createMockFetch = (handler) => {
  const originalFetch = global.fetch;
  const calls = [];

  global.fetch = async (url, options = {}) => {
    calls.push({ url, options });
    const data = await handler(url, options, calls.length - 1);
    return {
      ok: true,
      status: 200,
      json: async () => data,
    };
  };

  return {
    calls,
    restore: () => {
      global.fetch = originalFetch;
    },
  };
};

export { createMockFetch };