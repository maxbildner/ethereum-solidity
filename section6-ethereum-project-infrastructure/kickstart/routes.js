// second () is to invoke function returned from require()
const routes = require("next-routes")();

// routes.add("...", "...")

// routes object has helper functions that allow us to have dynamic routes/navigation (wild cards)
module.exports = routes;
