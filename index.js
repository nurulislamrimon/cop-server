// externel import
const colors = require("colors");

// internal import
const app = require("./app");
const errorHandler = require("./utilities/errorHandlers");
const homeRouter = require("./Routers/home.router");
const userRouter = require("./Routers/user.router");
const dbconnection = require("./utilities/dbconnection");

// database connection
dbconnection();
// routes
app.use("/", homeRouter);
app.use("/api/v1/user", userRouter);
// route doesn't exist error handler
app.use(errorHandler.routeDoesntExist);
// error handler
app.use(errorHandler.errorHandler);
// app listener
app.listen(process.env.port || 5000, () => {
  console.log(
    `App listening on port ${process.env.port || 5000}`.blue.bgCyan.bold
  );
});
