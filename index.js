// externel import
require("colors");

// internal import
const app = require("./app");
const errorHandler = require("./middlewares/error_handlers");
const homeRouter = require("./routers/home.router");
const userRouter = require("./routers/user.router");
const membersRouter = require("./routers/members.router");
const dbconnection = require("./utilities/dbconnection");

// database connection
dbconnection();
// routes
app.use("/", homeRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/members", membersRouter);
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
