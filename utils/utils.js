import fetch from 'isomorphic-fetch'
import Winston from 'winston'
import { LoggingWinston } from'@google-cloud/logging-winston'
import 'winston-daily-rotate-file'

import Promise from 'bluebird'
import fs_i from 'fs'
import rimraf_i from 'rimraf'
import simplevdf from 'simple-vdf'

import { prod, localAPI } from './runtime-vars'
import { version } from '../package.json'
import { data_url } from "../data/constants"


/* --- PROMISES --- */

const fs_needed = 'readdir stat access writeFile unlink mkdir rmdir'.split(' ')
export const fs = Promise.promisifyAll(fs_i, {
  filter: (name) => fs_needed.includes(name)
})

export const rimraf = Promise.promisify(rimraf_i)

export const delay = (duration) =>
  new Promise(resolve => setTimeout(resolve, duration))

export const fetchJSON = async (url) => localAPI
  ? JSON.parse(fs_i.readFileSync(`./api-test/raw/${url}.json`))
  : fetch(data_url[url]).then(res => res.json()).then(res => res)
export const fetchTXT = async (url) => localAPI
  ? JSON.parse(fs_i.readFileSync(`./api-test/raw/${url}.json`))
  : fetch(data_url[url]).then(res => res.text()).then(res => simplevdf.parse(res))

/* --- end PROMISES --- */




/* --- MISC --- */

export const timestamp = () => new Date().toISOString()

/* --- end MISC --- */




/* --- LOGGERS --- */
export const logger = new Winston.Logger({
  level: prod ? 'info' : 'debug'
})


logger.add(Winston.transports.DailyRotateFile, { filename: './logs/json', prepend: true } )
if(prod) {
  logger.add(LoggingWinston, {
    keyFilename: '../secrets/pocket-dota-logging.json',
    logName: 'dota-data-log',
    labels: {
      app: 'dota-data',
      version,
    }
  })
}



/* - console override - just making sure everything's covered - */
if(prod) {
  ['info', 'warn', 'error'].forEach(key => {
    console[key] = () => logger[key].apply(logger, arguments)
  })
} else {
  logger.add(Winston.transports.Console)
}
/* --- end LOGGERS --- */