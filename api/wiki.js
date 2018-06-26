import { fs, logger, rimraf, timestamp } from '../utils/utils'
import { VERSIONF_BASE, VERSIONF_PREFIX, VERSIONF_BASE_RAW, currentWikiVersion, currentWikiVersionDate, incrementWikiVersion } from './wiki-versioning'

import { generateItems } from '../data/items_utils'
import { generateHeroes } from '../data/hero_utils'
import { generateDotaTips } from '../data/tips_utils'
import { getRawData, createFile, checkSize } from './wiki_utils'



/* creates a new folder containing the data gathered from the APIs 
 * and keeps it while updating the current version if ** conditions are met
*/
export const checkIfDataNeedsUpdate = async () => {
  let allData = null
  
  /// gather raw data
  allData = await getRawData()
  if(!allData) return null

  const versionDate = timestamp()
  const oldDataF = `${VERSIONF_BASE}/${VERSIONF_PREFIX}${currentWikiVersion}_${currentWikiVersionDate}`
  const newDataF = `${VERSIONF_BASE}/${VERSIONF_PREFIX}${currentWikiVersion+1}_${versionDate}`
  const newDataF_raw = `${VERSIONF_BASE}/${VERSIONF_PREFIX}${currentWikiVersion+1}_${versionDate}/${VERSIONF_BASE_RAW}`


  /// create temp folder and store new data in it
  if(!fs.existsSync(newDataF)) {
    logger.log('debug', `creating new version folder: ${newDataF}`)
    await fs.mkdirAsync(newDataF)
  }
  
  const arr_diff = []
  const keys = Object.keys(allData)
  
  let oldDataFExists = true
  // ** check if the old version data exists
  if(!fs.existsSync(oldDataF)) {
    arr_diff.push(`old version folder does not exist ${oldDataF}`)
    oldDataFExists = false
  }
  for (let key of keys) {
    // create the new data files
    if(!fs.existsSync(newDataF_raw)) {
      logger.log('debug', `creating new version folder: ${newDataF_raw}`)
      await fs.mkdirAsync(newDataF_raw)
    }
    await createFile(key, newDataF_raw, allData[key])
    
    // ** check if new data files sizes are different from ** existing data files
    oldDataFExists && await checkSize(key, `${oldDataF}/${VERSIONF_BASE_RAW}`, newDataF_raw) && arr_diff.push(`file ${key} has a different size or is missing`)
    
  }

  if(!arr_diff.length > 0) {
    // remove the new data because a ** condition has been met
    logger.log('debug', `discarding new version folder ${newDataF}. Everything is the same.`)
    try {
      await rimraf(newDataF)
    } catch(e) {
      logger.error(`error while removing folder ${newDataF}. Next version number might be affected.`, e)
    }
    return false
  } else {
    // generate the new data files and finally increment the wiki version
    const parsedData = await gatherData(allData, newDataF)
    
    if(!parsedData) {
      logger.warn(`discarding new version folder ${newDataF} because new data could not be generated`)
      try {
        await rimraf(newDataF)
      } catch(e) {
        logger.error(`error while removing folder ${newDataF}. Next version number might be affected.`, e)
      }
      return null
    } else {
      logger.info(`new version data stays because: ${arr_diff}`)
      incrementWikiVersion(versionDate)
      return parsedData
    }
  } 
  
}


/* data formatted as needed in the React Native APP */
const gatherData = async (data, newDataF) => {
  logger.info('--- generating data files')
  let heroes = await getHeroes(data, newDataF)
  let items = await getItems(data, newDataF)
  let tips = await getDotatips(data, newDataF)

  if(!heroes || !items || !tips) return null
  else return { heroes, items, tips }
}



const getHeroes = async (data, newDataF) => {
  try {
    const heroes = generateHeroes(data)
    await createFile('heroes', newDataF, heroes)

    return heroes
  } catch(e) {
    logger.error('error: while generating heroes.json', e)
    return null
  }
}

const getItems = async (data, newDataF) => {
  try {
    const items = generateItems(data)
    await createFile('items', newDataF, items)

    return items
  } catch(e) {
    logger.error('error: while generating items.json', e)
    return null
  }
}


const getDotatips = async (data, newDataF) => {
  try {
    const tips = generateDotaTips(data)
    await createFile('tips', newDataF, tips)

    return tips
  } catch(e) {
    logger.error('error: could not gather tips', e)
    return null
  }
}
