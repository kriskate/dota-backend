import { skip } from '../utils/runtime-vars'
import { fs, logger, ncp, rimraf, timestamp } from '../utils/utils'
import { VERSIONF_BASE, getVersionFolder, getTempFolder, setVersions, setCurrent, getNew } from './wiki-versioning'

import PromisePool from 'es6-promise-pool';

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
  let needsUpdate = setVersions();

  const tempFolder = getTempFolder("");
  const versionFolder = getVersionFolder("");

  if(fs.existsSync(tempFolder)) await rimraf(tempFolder);
  if(!fs.existsSync(tempFolder)) {
    logger.debug(`creating new version folder: ${tempFolder}`)
    await fs.mkdirAsync(tempFolder);
  }

  needsUpdate = await checkAllLanguages();

  logger.debug('wiki needs update:', needsUpdate);

  if(needsUpdate) {
    const info = await generateData(getNew, 'info', null, tempFolder);
    await createFile('info', tempFolder, info);
    setCurrent(getNew());

    await ncp(getTempFolder(""), getVersionFolder(""));
  }

  await rimraf(tempFolder);

  return needsUpdate
}


const checkAllLanguages = async (needsUpdate) => {
  const keys = Object.keys(languages);
  let cLang = -1;

  const promiseProducer = () => {
    if(cLang < keys.length - 1) {
      cLang++;
      return new Promise(async (resolve) => {
        const lang = languages[keys[cLang]];
        logger.info(`-- checking language ${lang} ${cLang+1}/${keys.length}`)
        if(await checkLanguage(lang)) needsUpdate = true;
        resolve();
      })
    }
    return null;
  }
  
  await new PromisePool(promiseProducer, 1).start();

  return needsUpdate;
}


const checkLanguage = async (language) => {

  const newDataF = getTempFolder(language);
  const oldDataF = getVersionFolder(language);


  /// gather raw data
  let allData = allData = await getRawData(language);
  if(!allData) return false

  allData.language = language;

  /// create temp folder and store new data in it
  if(!fs.existsSync(newDataF)) {
    logger.debug(`creating new language folder: ${newDataF}`)
    await fs.mkdirAsync(newDataF)
  }
  

  const arr_diff = []
  
  // ** check if the old version data exists
  let oldDataFExists = true
  if(!fs.existsSync(oldDataF)) {
    arr_diff.push(`old version folder does not exist ${oldDataF}`)
    oldDataFExists = false
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
      logger.info(`language ${language} data stays because: ${arr_diff}`)

      return true
  } 
  
}


/* data formatted as needed in the React Native APP */
const gatherData = async (data, newDataF) => {
  let heroes = await generateData(generateHeroes, 'heroes', data, newDataF)
  let items = await generateData(generateItems, 'items', data, newDataF)
  let tips = await generateData(generateDotaTips, 'tips', data, newDataF)

  let patch_notes = await generateData(generatePatchNotes, 'patch_notes', data, newDataF)
  
  // let info = await generateData(getNew, 'info', null, newDataF)

  if(!heroes || !items || !tips || !patch_notes) return null
  else return { heroes, items, tips, patch_notes }
}

async function generateData (generator, filename, data, newDataF) {
  // debug individual assets -- reduces compile times
  if(skip && skip.includes(filename)) return {}

  try {
    logger.info(`- generating data files for - ${filename} `)
    const generatedData = await generator(data)
    await createFile(filename, newDataF, generatedData)

    return generatedData
  } catch(e) {
    logger.error(`error: while generating ${filename}.json`, e)
    return null
  }
}