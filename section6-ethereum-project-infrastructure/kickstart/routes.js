// second () is to invoke function returned from require()
const routes = require("next-routes")();

// create a route- .add(1st arg, 2nd arg)
// 1st arg = path user goes to
//    variable after : is passed into component
// 2nd arg = what will be rendered at that path
routes
  .add("/campaigns/new", "/campaigns/new") // must be before below!!
  .add("/campaigns/:address", "/campaigns/show")
  .add("/campaigns/:address/requests", "/campaigns/requests/index") // renders index.js inside requests folder
  .add("/campaigns/:address/requests/new", "/campaigns/requests/new");

// routes object has helper functions that allow us to have dynamic routes/navigation (wild cards)
module.exports = routes;
