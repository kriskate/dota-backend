import fetch from 'isomorphic-fetch'
import Winston from 'winston'
import { LoggingWinston } from'@google-cloud/logging-winston'
import 'winston-daily-rotate-file'

import Promise from 'bluebird'
import fs_i from 'fs'
import rimraf_i from 'rimraf'

import { version } from '../package.json'



/* --- PROMISES --- */

const fs_needed = 'readdir stat access writeFile unlink mkdir rmdir'.split(' ')
export const fs = Promise.promisifyAll(fs_i, {
  filter: (name) => fs_needed.includes(name)
})

export const rimraf = Promise.promisify(rimraf_i)

export const delay = (duration) =>
  new Promise(resolve => setTimeout(resolve, duration))

export const fetchJSON = (url) => fetch(url).then(res => res.json()).then(res => res)

/* --- end PROMISES --- */




/* --- MISC --- */

export const timestamp = () => new Date().toISOString()

/* --- end MISC --- */




/* --- LOGGERS --- */

export const logger = new Winston.Logger()


if(process.env.NODE_ENV == 'development')
  logger.add(Winston.transports.DailyRotateFile, { filename: './logs/json', prepend: true } )
else {
  logger.add(LoggingWinston, {
    keyFilename: '../secrets/pocket-dota-logging.json',
    logName: 'dota-data-log',
    labels: {
      app: 'dota-data',
      version,
    }
  })
}



export const accessLogger = new (Winston.Logger)({
  transports: [
    new (Winston.transports.DailyRotateFile)({
      filename: './logs-access/json', prepend: true,
    })
  ]
})


/* - console override - just making sure everything's covered - */
if(process.env.NODE_ENV == 'production') {
  ['info', 'warn', 'error'].forEach(key => {
    console[key] = () => logger[key].apply(logger, arguments)
  })
}
/* --- end LOGGERS --- */