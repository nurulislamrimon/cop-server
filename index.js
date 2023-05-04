// externel import
require("colors");

// internal import
const app = require("./app");
const errorHandler = require("./middlewares/error_handlers");
const homeRouter = require("./routers/home.router");
const userRouter = require("./routers/user.router");
const membersRouter = require("./routers/members.router");
const committeeRouter = require("./routers/committee.router");
const adminRouter = require("./routers/admin.router");
const depositRouter = require("./routers/deposit.router");
const withdrawRouter = require("./routers/withdraw.router");
const investmentRouter = require("./routers/investment.router");
const businessRouter = require("./routers/business.router");
const dbconnection = require("./utilities/dbconnection");

// database connection
dbconnection();
// routes
app.use("/", homeRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/members", membersRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/committee", committeeRouter);
app.use("/api/v1/business", businessRouter);
app.use("/api/v1/finance/deposit", depositRouter);
app.use("/api/v1/finance/withdraw", withdrawRouter);
app.use("/api/v1/finance/investment", investmentRouter);
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
