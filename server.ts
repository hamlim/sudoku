Bun.serve({
  port: 3000,
  async fetch(req) {
    let url = new URL(req.url);
    let path = url.pathname;

    console.log(`Req for: ${path}`);

    switch (path) {
      case "/":
        return new Response(Bun.file("index.html"));
      default:
        return new Response(Bun.file(`.${path}`));
    }
  },
});
