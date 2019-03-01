import { skip } from '../utils/runtime-vars'
import { fs, logger, rimraf, timestamp } from '../utils/utils'
import { VERSIONF_BASE, current, setCurrent, getNew, setNew, getVersionFolder } from './wiki-versioning'

import { generateItems } from '../data/items_utils'
import { generateHeroes } from '../data/hero_utils'
import { generateDotaTips } from '../data/tips_utils'
import { generatePatchNotes } from '../data/patch_notes_utils'
import { getRawData, createFile, checkSize } from './wiki_utils'



export const languages = {
  "de-DE": 'german',
  "en-US": 'english',
  "es-ES": 'spanish',
  "fr-FR": 'french',
  "ja-JP": 'japanese',
  "ro-RO": 'romanian',
  "ru-RU": 'russian',
}
/* creates a new folder containing the data gathered from the APIs 
 * and keeps it while updating the current version if ** conditions are met
*/
export const checkIfDataNeedsUpdate = async () => {
  let allData = null
  
  /// gather raw data
  allData = await getRawData("english");
  if(!allData) return false

  const newWikiVersion = current().wikiVersion + 1;
  const newWikiVersionDate = timestamp();
  const newAppVersion = require('../package.json').version;

  const newDataF = getVersionFolder(newWikiVersionDate, newWikiVersion);
  const oldDataF = getVersionFolder();

  setNew({
    appVersion: newAppVersion,
    // dotaVersion and date are set in patch_notes_utils
    wikiVersion: newWikiVersion,
    wikiVersionDate: newWikiVersionDate,
    wikiVersionFolder: newDataF.replace(VERSIONF_BASE + '/', ''),
  })

  

  /// create temp folder and store new data in it
  if(!fs.existsSync(newDataF)) {
    logger.debug(`creating new version folder: ${newDataF}`)
    await fs.mkdirAsync(newDataF)
  }
  

  const arr_diff = []
  
  // ** check if the old version data exists
  let oldDataFExists = true
  if(!fs.existsSync(oldDataF)) {
    arr_diff.push(`old version folder does not exist ${oldDataF}`)
    oldDataFExists = false
  }
  
  // check if app version is the same
  if(newAppVersion !== current().appVersion) {
    arr_diff.push(`the current info has been generated with an older app version (${current().appVersion})`)
  }

  // generate the new data files
  const parsedData = await gatherData(allData, newDataF);
  if(!parsedData) {
    logger.warn(`discarding new version folder ${newDataF} because new data could not be generated`)
    try {
      await rimraf(newDataF)
    } catch(e) {
      logger.error(`error while removing folder ${newDataF}. Next version number might be affected.`, e)
    }
    return false
  }

  // ** check if new data files sizes are different from ** existing data files
  const keys = Object.keys(parsedData);
  for (var i = 0; i < keys.length; i++) {
    const key = keys[i];
    if(oldDataFExists && await checkSize(key, oldDataF, newDataF))
      arr_diff.push(`file ${key} has a different size`);
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
      logger.info(`new version data stays because: ${arr_diff}`)
      await createFile('info', VERSIONF_BASE, parsedData.info);
      setCurrent(getNew());

      return parsedData
  } 
  
}


/* data formatted as needed in the React Native APP */
const gatherData = async (data, newDataF) => {
  logger.info('--- generating data files')

  let heroes = await generateData(generateHeroes, 'heroes', data, newDataF)
  let items = await generateData(generateItems, 'items', data, newDataF)
  let tips = await generateData(generateDotaTips, 'tips', data, newDataF)

  let patch_notes = await generateData(generatePatchNotes, 'patch_notes', data, newDataF)
  
  let info = await generateData(getNew, 'info', null, newDataF)

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