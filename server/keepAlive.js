const http = require('http');
const https = require('https');

const KEEP_ALIVE_MS = 14 * 60 * 1000;

function resolveKeepAliveUrl() {
  const base =
    process.env.KEEP_ALIVE_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    process.env.PUBLIC_APP_URL;

  if (!base) return null;

  const normalized = base.replace(/\/$/, '');
  return `${normalized}/api/health`;
}

function ping(url) {
  const client = url.startsWith('https') ? https : http;

  const req = client.get(url, (res) => {
    res.resume();
    if (res.statusCode && res.statusCode >= 400) {
      console.warn(`[keep-alive] ${url} → HTTP ${res.statusCode}`);
    }
  });

  req.on('error', (err) => {
    console.warn(`[keep-alive] ping failed: ${err.message}`);
  });

  req.setTimeout(15000, () => {
    req.destroy();
    console.warn('[keep-alive] ping timed out');
  });
}

function startKeepAlive() {
  if (process.env.ENABLE_KEEP_ALIVE === 'false') {
    console.log('[keep-alive] disabled (ENABLE_KEEP_ALIVE=false)');
    return;
  }

  const url = resolveKeepAliveUrl();
  if (!url) {
    console.log(
      '[keep-alive] skipped — set RENDER_EXTERNAL_URL or KEEP_ALIVE_URL (Render sets RENDER_EXTERNAL_URL automatically)',
    );
    return;
  }

  console.log(`[keep-alive] pinging ${url} every ${KEEP_ALIVE_MS / 60000} minutes`);
  ping(url);
  setInterval(() => ping(url), KEEP_ALIVE_MS);
}

module.exports = { startKeepAlive, resolveKeepAliveUrl };
