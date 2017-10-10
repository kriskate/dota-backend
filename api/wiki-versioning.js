//import promisifyAll from 'util-promisifyAll'
//const fs = promisifyAll(require('fs'))

import {fs, logger} from '../utils/utils'

export const VERSIONF_BASE = 'versioned_data'
export const VERSIONF_PREFIX = 'v-'

export let currentWikiVersion = 0
export let currentWikiVersionDataFolder = 'v-0'

export const incrementWikiVersion = () => { 
  currentWikiVersion++
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
    const v = parseInt(folder.replace(VERSIONF_PREFIX, '').split('-')[0])
    if(v !== NaN && v > currentWikiVersion) {
      currentWikiVersion = v
      currentWikiVersionDataFolder = folder
    }
  })

  logger.info(`current WIKI version is: ${currentWikiVersion}`)
}