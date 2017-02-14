// -*- mode: react; -*-
import bunyan from 'bunyan';

const obj = {};

if (!obj.logger) {
  let streams = [{
    level: "error",
    type: 'rotating-file',
    path: './logs/error.log',
    period: '1d', // daily rotation
    count: 30 // keep 3 back copies
  }, {
    level: "info",
    type: 'rotating-file',
    path: './logs/info.log',
    period: '1d', // daily rotation
    count: 30 // keep 3 back copies
  }];

  if (process.env.NODE_ENV) {
    streams.push({
      level: "info",
      stream: process.stdout
    });
  }

  obj.logger = bunyan.createLogger({
    name: "iacp",
    streams: streams
  });
}

export default obj.logger;
