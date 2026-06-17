// Cloudflare Worker — Five in a Row
// Routes clean URLs (/about, /privacy) to their .html files.
// Everything else falls through to the static Assets binding.

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Scroll-text identifier for live debugging.
    const debugTag = `[five-in-a-row ${new Date().toISOString()}]`;

    // Clean URL rewrite: /about → /about.html (no recursion — file already has extension)
    if (url.pathname !== '/' && !url.pathname.includes('.') && !url.pathname.endsWith('/')) {
      const rewritten = new URL(request.url);
      rewritten.pathname = url.pathname + '.html';
      console.log(debugTag, 'rewrite', url.pathname, '→', rewritten.pathname);
      return env.ASSETS.fetch(new Request(rewritten, request));
    }

    // Trailing slash on a directory: let Assets serve the index.html.
    return env.ASSETS.fetch(request);
  },
};
