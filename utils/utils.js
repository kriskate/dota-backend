import fetch from 'isomorphic-fetch'
import Winston from 'winston'
import { LoggingWinston } from'@google-cloud/logging-winston'
import 'winston-daily-rotate-file'

import Promise from 'bluebird'
import fs_i from 'fs'
import rimraf_i from 'rimraf'
import ncp_i from 'ncp';
import simplevdf from 'simple-vdf'

import { prod, localAPI } from './runtime-vars'
import { version } from '../package.json'
import { data_url } from "../data/constants"


/* --- PROMISES --- */

const fs_needed = 'readdir copyFile rename stat access writeFile unlink mkdir rmdir readFileSync'.split(' ')
export const fs = Promise.promisifyAll(fs_i, {
  filter: (name) => fs_needed.includes(name)
})

export const rimraf = Promise.promisify(rimraf_i)
export const ncp = Promise.promisify(ncp_i)

export const delay = (duration) =>
  new Promise(resolve => setTimeout(resolve, duration))

const defaultLanguage = "english"
export const fetcher_TYPES = {
  JSON: "JSON",
  TXT: "TXT",
  HeroLore: "HeroLore",
}
export const fetcher = async (TYPE, url, lg=defaultLanguage) => {
  const _url = isFunction(data_url[url]) ? data_url[url](lg) : data_url[url];
  const res = await fetch(_url);

  switch(TYPE) {
    case fetcher_TYPES.JSON:
      return await res.json();
    case fetcher_TYPES.TXT:
      const txt = await res.text();
      return simplevdf.parse(txt);
    case fetcher_TYPES.HeroLore:
      const lore = await res.text();
      return simplevdf.parse(lore.replace(/\r?\n?[^\r\n]*$/, ""));
    case fetcher_TYPES.RawTXT:
      return await res.text();
  }
}

export const fetchRawTXT = async (url) => 
  fetch(url).then(res => res.text()).then(res => res)



/* --- end PROMISES --- */




/* --- MISC --- */

export const isFunction = (func) => typeof func === "function";

export const timestamp = (d) => {
  const zero = (what) => ('0' + what).slice(-2);
  
  const date = d ? new Date(d) : new Date();
  return (
    date.getFullYear() + '-' + zero(date.getMonth()+1) + '-' + zero(date.getDate()) +  '_' + 
    zero(date.getHours()) + '-' + zero(date.getMinutes()) + '-' + zero(date.getSeconds())
  )
}

/* --- end MISC --- */




/* --- LOGGERS --- */
export const logger = new Winston.Logger({
  level: prod ? 'info' : 'debug'
})


logger.add(Winston.transports.DailyRotateFile, { filename: './logs/json', prepend: true } )
// if(prod) {
//   logger.add(LoggingWinston, {
//     keyFilename: '../secrets/pocket-dota-logging.json',
//     logName: 'dota-data-log',
//     labels: {
//       app: 'dota-data',
//       version,
//     }
//   })
// }


const config = Winston.config;
/* - console override - just making sure everything's covered - */
//if(prod) {
//  ['info', 'warn', 'error'].forEach(key => {
//    console[key] = () => logger[key].apply(logger, arguments)
//  })
//} else {
  logger.add(Winston.transports.Console, 
    {
      colorize: true,
      timestamp: () => '[' + (new Date()).toISOString().slice(0, 19).replace('T', ' ') + ']'
    },

  )
//}
/* --- end LOGGERS --- */