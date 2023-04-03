// externel import

// internal import
const app = require("./app");
const errorHandler = require("./utilities/errorHandlers");
const homeRouter = require("./Routers/home.router");

// database connection

// routes
app.use("/", homeRouter);

// route doesn't exist error handler
app.use(errorHandler.routeDoesntExist);
// error handler
app.use(errorHandler.errorHandler);
// app listener
app.listen(process.env.port || 5000, () => {
  console.log(`App listening on port ${process.env.port || 5000}`);
});
