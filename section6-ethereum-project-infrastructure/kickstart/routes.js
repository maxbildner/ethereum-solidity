// second () is to invoke function returned from require()
const routes = require("next-routes")();



// create a route- .add(1st arg, 1nd arg)
// 1st arg = path user goes to
//    variable after : is passed into component
// 2nd arg = what will be rendered at that path
routes
  .add("/campaigns/new", "/campaigns/new") // must be before below!!
  .add("/campaigns/:address", "/campaigns/show")


// routes object has helper functions that allow us to have dynamic routes/navigation (wild cards)
module.exports = routes;
