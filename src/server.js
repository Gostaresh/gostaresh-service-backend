"use strict";

require("dotenv").config();
const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 3100;

const server = http.createServer(app);

(async () => {
  try {
    if (app.ready && typeof app.ready.then === "function") {
      await app.ready;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Continuing to start despite AdminJS setup error:", e);
  }
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
})();
