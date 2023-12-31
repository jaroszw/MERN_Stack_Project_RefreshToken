const { logEvents } = require("../middleware/logger");

const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}\t ${err.message} ${req.method}\t${req.url}\t${req.headers.host}\t ${req.headers.origin}`,
    "errorLog.log"
  );
  console.log(err.stack);
  const status = res.statusCode ? res.statusCode : 500;

  res.status(status);
  res.json({ message: err.message });
  next();
};

module.exports = errorHandler;
