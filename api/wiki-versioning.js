//import promisifyAll from 'util-promisifyAll'
//const fs = promisifyAll(require('fs'))

import { fs, logger, timestamp } from '../utils/utils'


export const VERSIONF_BASE = 'versioned_data'
export const VERSIONF_BASE_RAW = 'raw'
export const VERSIONF_PREFIX = 'v_'

export let currentWikiVersion = 0
export let currentWikiVersionDate = timestamp()
export let currentDotaVersion = 0
export const setCurrentDotaVersion = (version) => currentDotaVersion = version

export const incrementWikiVersion = (versionDate) => { 
  currentWikiVersion++
  currentWikiVersionDate = versionDate
  logger.info(`incremented WIKI version to: ${currentWikiVersion}`)
 }

/* only called once, when the service starts
 * checks for folder names
 * might change if the server will git push version folders
 */
export const initializeVersionSystem = async () => {
  // ASYNC iterate through all version folders and see latest
  let files = await fs.readdirAsync(VERSIONF_BASE)

  let folders = files.filter(async file => {
    try {
      const cFile = `${VERSIONF_BASE}/${file}`
      let stat = await fs.statAsync(cFile)
      return stat.isDirectory() && cFile.includes(VERSIONF_PREFIX)
    } catch(e) {
      return false
    }
  })

  // after all directories' names have been read, check which version is the highest
  folders.forEach(folder => {
    const v = parseInt(folder.split('_')[1])
    const d = new Date(folder.split('_')[2])
    if(v !== NaN && v > currentWikiVersion || (d && d > currentWikiVersionDate)) {
      currentWikiVersion = v
      currentWikiVersionDate = d.toISOString()

    }
  })

  logger.debug(`current WIKI version is: ${currentWikiVersion}`)
}