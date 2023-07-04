require("dotenv").config();
require("express-async-errors");
const express = require("express");

const app = express();

const connectDB = require("./db/connect");
const jobsRouter = require("./routes/jobs");
const authRouter = require("./routes/auth");
const authenticateUser = require("./middleware/authentication");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const path = require("path");
// extra packages
const helmet = require("helmet");
const xss = require("xss-clean");

app.use(express.static(path.join(__dirname, "./client/build")));
app.use(express.json());
app.use(helmet());
app.use(xss());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);
app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "client", "./client/build", "index.html")
  );
});
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
