// Shared ports/URLs for the Playwright E2E suite. Kept off the app's normal
// dev port (3000) and the mock server's port isolated from anything else
// running locally.
export const MOCK_PORT = 4310;
export const APP_PORT = 3100;

export const MOCK_SERVER_URL = `http://127.0.0.1:${MOCK_PORT}`;
export const APP_URL = `http://127.0.0.1:${APP_PORT}`;
