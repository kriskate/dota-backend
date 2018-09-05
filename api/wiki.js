import { skip } from '../utils/runtime-vars'
import { fs, logger, rimraf, timestamp } from '../utils/utils'
import { VERSIONF_BASE, VERSIONF_PREFIX, VERSIONF_BASE_RAW, currentWikiVersion, currentWikiVersionDate, incrementWikiVersion } from './wiki-versioning'

import { generateItems } from '../data/items_utils'
import { generateHeroes } from '../data/hero_utils'
import { generateDotaTips } from '../data/tips_utils'
import { generatePatchNotes } from '../data/patch_notes_utils'
import { getRawData, createFile, checkSize, gatherInfoData, compareAppVersion } from './wiki_utils'



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
    logger.debug(`creating new version folder: ${newDataF}`)
    await fs.mkdirAsync(newDataF)
  }
  
  const arr_diff = []
  const keys = Object.keys(allData)
  
  let oldDataFExists = true
  // ** check if the old version data exists
  if(!fs.existsSync(oldDataF)) {
    arr_diff.push(`old version folder does not exist ${oldDataF}`)
    oldDataFExists = false
  } else {
    const oldInfo = JSON.parse(fs.readFileSync(`${oldDataF}/info.json`, 'utf8'));
    const old_version = oldInfo.app_version

    if(!compareAppVersion(old_version))
      arr_diff.push(`the current info has been generated with an older app version (${old_version})`)
  }

  for (let key of keys) {
    // create the new data files
    if(!fs.existsSync(newDataF_raw)) {
      logger.debug(`creating new version folder: ${newDataF_raw}`)
      await fs.mkdirAsync(newDataF_raw)
    }
    await createFile(key, newDataF_raw, allData[key])
    
    // ** check if new data files sizes are different from ** existing data files
    oldDataFExists && await checkSize(key, `${oldDataF}/${VERSIONF_BASE_RAW}`, newDataF_raw) && arr_diff.push(`file ${key} has a different size`)
    
  }

  if(!arr_diff.length > 0) {
    // remove the new data because a ** condition has been met
    logger.debug(`discarding new version folder ${newDataF}. Everything is the same.`)
    try {
      await rimraf(newDataF)
    } catch(e) {
      logger.error(`error while removing folder ${newDataF}. Next version number might be affected.`, e)
    }
    return false
  } else {
    // generate the new data files and finally increment the wiki version
    const parsedData = await gatherData(allData, newDataF, versionDate)
    
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
      await createFile('info', VERSIONF_BASE, parsedData.info);

      return parsedData
    }
  } 
  
}


/* data formatted as needed in the React Native APP */
const gatherData = async (data, newDataF, versionDate) => {
  logger.info('--- generating data files')

  let heroes = await generateData(generateHeroes, 'heroes', data, newDataF)
  let items = await generateData(generateItems, 'items', data, newDataF)
  let tips = await generateData(generateDotaTips, 'tips', data, newDataF)

  let patch_notes = await generateData(generatePatchNotes, 'patch_notes', data, newDataF)
  
  let info = await generateData(gatherInfoData, 'info', versionDate, newDataF)

  if(!heroes || !items || !tips || !patch_notes || !info) return null
  else return { heroes, items, tips, patch_notes, info }
}

async function generateData (generator, filename, data, newDataF) {
  // debug individual assets -- reduces compile times
  if(skip && skip.includes(filename)) return {}

  try {
    const generatedData = await generator(data)
    await createFile(filename, newDataF, generatedData)

    return generatedData
  } catch(e) {
    logger.error(`error: while generating ${filename}.json`, e)
    return null
  }
}