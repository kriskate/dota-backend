import { fs, logger, rimraf, timestamp } from '../utils/utils'
import { VERSIONF_BASE, VERSIONF_PREFIX, currentWikiVersion, currentWikiVersionDate, incrementWikiVersion } from './wiki-versioning'

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


  /// create temp folder and store new data in it
  if(!fs.existsSync(newDataF)) {
    logger.info(`creating new version folder: ${newDataF}`)
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
    await createFile(key, newDataF, allData[key])
    
    // ** check if new data files sizes are different from ** existing data files
    oldDataFExists && await checkSize(key, oldDataF, newDataF) && arr_diff.push(`file ${key} has a different size or is missing`)
    
  }

  if(!arr_diff.length > 0) {
    // remove the new data because a ** condition has been met
    logger.info(`discarding new version folder ${newDataF}`)
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
      logger.info(`discarding new version folder ${newDataF} because new data could not be generated`)
      try {
        await rimraf(newDataF)
      } catch(e) {
        logger.error(`error (2) while removing folder ${newDataF}. Next version number might be affected.`, e)
      }
      return null
    } else {
      logger.info(`new version data stays because: ${arr_diff}`)
      incrementWikiVersion(newDataF, versionDate)
      return parsedData
    }
  } 
  
}


/* data formatted as needed in the React Native APP */
const gatherData = async (data, newDataF) => {
  let heroes = await getHeroes(data, newDataF)
  let items = await getItems(data, newDataF)
  let tips = await getDotatips(data, newDataF)

  if(!heroes || !items || !tips) return null
  else return { heroes, items, tips }
}



const getHeroes = async (data, newDataF) => {
  try {
    const heroes = generateHeroes(data)

    logger.info(`creating parsed hero data, ${newDataF}/heroes.json`)
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

    logger.info(`creating parsed items data, ${newDataF}/items.json`)
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

    if(tips) await createFile('tips', newDataF, tips)

    return tips
  } catch(e) {
    logger.error('error: could not gather tips', e)
    return null
  }
}
