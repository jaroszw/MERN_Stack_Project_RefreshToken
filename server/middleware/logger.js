const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logger = (req, res, next) => {
  logEvents(`${req.method}\t ${req.url} ${req.headers.host}`, 'reqLog.log');
  next();
};

const logEvents = (message, logFileName) => {
  const dayTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
  const logItem = `${dayTime}\t${uuid()}\t${message}\n`;
  if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
    fs.mkdirSync(path.join(__dirname, '..', 'logs'));
  }

  fs.promises.appendFile(
    path.join(__dirname, '..', 'logs', logFileName),
    logItem
  );
};

module.exports = { logEvents, logger };
