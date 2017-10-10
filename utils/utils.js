import fetch from 'isomorphic-fetch'
import winston from 'winston'
import 'winston-daily-rotate-file'

import Promise from 'bluebird'
import fs_i from 'fs'
import rimraf_i from 'rimraf'


let fs_wants = 'readdir stat access writeFile unlink mkdir rmdir'.split(' ')
export const fs = Promise.promisifyAll(fs_i, {
  filter: (name) => fs_wants.includes(name)
})
export const rimraf = Promise.promisify(rimraf_i)


export const delay = (duration) =>
  new Promise(resolve => setTimeout(resolve, duration))



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


export const fetchJSON = (url) => fetch(url).then(res => res.json()).then(res => res)

export const timestamp = () => new Date().toISOString()