const { createServer } = require("http");
const next = require("next");

// create a new app instance
const app = next({
  // dev specifies whether we are running server in produciton or development mode
  dev: process.env.NODE_ENV !== "production",
});

// import routes file
const routes = require("./routes");

const handler = routes.getRequestHandler(app);

// setup app and tell it to listen to a certain port
app.prepare().then(() => {
  createServer(handler).listen(3000, (err) => {
    if (err) throw err;
    console.log("Ready on localhost:3000");
  });
});
