import { serve } from "bun";
import index from "./index.html";

let server = serve({
  routes: {
    "/": index,
    "/data/:path": (req) => {
      let path = req.params.path;
      return new Response(Bun.file(`../data/${path}`), {
        headers: {
          "Content-Type": "text/csv",
        },
      });
    },
  },

  development: true,
  //   development: process.env.NODE_ENV === "development",
});

console.log(`Server is running on ${server.url}`);
