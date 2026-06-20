async function waitFor(url, timeoutMs = 120000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Service not ready yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

module.exports = async () => {
  const baseUrl = process.env.BASE_URL ?? "http://localhost:19006";
  const apiBaseUrl = process.env.API_URL ?? "http://localhost:8080";

  await waitFor(baseUrl);
  await waitFor(`${apiBaseUrl}/health`);
};
