// -*- mode: react; -*-
import bunyan from 'bunyan';

const obj = {};

if (!obj.logger) {
  const streams = [{
    level: 'error',
    stream: process.stderr, // PM2 will handle the logs
    // type: 'rotating-file',
    // path: './logs/error.log',
    // period: '1d', // daily rotation
    // count: 30, // keep 3 back copies
  }, {
    level: 'info',
    stream: process.stdout, // PM2 will handle the logs
    // type: 'rotating-file',
    // path: './logs/info.log',
    // period: '1d', // daily rotation
    // count: 30, // keep 3 back copies
  }];

  obj.logger = bunyan.createLogger({
    name: 'iacp',
    streams,
  });
}

export default obj.logger;
