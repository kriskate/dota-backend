import fetch from 'isomorphic-fetch'
import winston from 'winston'
import 'winston-daily-rotate-file'

import Promise from 'bluebird'
import fs_i from 'fs'
import rimraf_i from 'rimraf'




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

export const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.DailyRotateFile)({
      filename: './logs/json', prepend: true,
    })
   ] 
})

export const accessLogger = new (winston.Logger)({
  transports: [
    new (winston.transports.DailyRotateFile)({
      filename: './logs-access/json', prepend: true,
    })
  ]
})

/* --- end LOGGERS --- */