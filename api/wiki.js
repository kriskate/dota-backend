import { skip } from '../utils/runtime-vars'
import { fs, logger, rimraf, timestamp } from '../utils/utils'
import { initializeVersionSystem, getLocalWiki } from './wiki-versioning'

import { generateItems } from '../data/items_utils'
import { generateHeroes } from '../data/hero_utils'
import { generateDotaTips } from '../data/tips_utils'
import { generatePatchNotes } from '../data/patch_notes_utils'
import { generateInfo, getRawData } from './wiki_utils'
import { model_current } from '../data/models/model_wiki';
import { getCurrentWiki } from './DB';



/* creates a new folder containing the data gathered from the APIs 
 * and keeps it while updating the current version if ** conditions are met
*/
export const checkIfDataNeedsUpdate = async () => {  
  logger.debug('gathering raw data');
  const rawData = await getRawData()
  if(!rawData) return null
  
  
  logger.debug('getting current info');
  const currentInfo = getLocalWiki().current;
  const arr_diff = []


  logger.debug('checking app version');
  const appVersion = require('../package.json').version;
  if(currentInfo.appVersion !== appVersion) {
    arr_diff.push(`* the current info has been generated with an older app version (${currentInfo.appVersion} vs ${appVersion})`);
  }


  logger.debug('checking current wiki raw/ json size');
  const currentWiki = await getCurrentWiki();
  
  if(!currentWiki.raw) {
    arr_diff.push(`* old data does not contain any raw data`)
  } else if(arr_diff.length < 1) {
    const keys = Object.keys(rawData);
    for(let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if(!currentWiki.raw[key]) {
        arr_diff.push(`* old data does not have key ${key}`);
        break;
      } else if(JSON.stringify(rawData[key]).length !== currentWiki.raw[key].length) {
        arr_diff.push(`* key ${key} has a different size`);
        break;
      } else continue;
    }
  }

  if(arr_diff.length < 1) {
    logger.debug(`discarding new version. Everything is the same.`)
    return false;
  } else {
    logger.info('--- generating data files')
    
    const parsedData = await gatherData(rawData);
    
    if(parsedData) {
      logger.info(`new version data stays because: ${arr_diff.join(' AND ')}`);
      return parsedData
    } else {
      logger.warn(`discarding new version because new data could not be generated`);
      return null
    }
  } 
  
}


/* data formatted as needed in the React Native APP */
const gatherData = async (data) => {

  const dotaInfo = {
    dotaVersion: 0,
    dotaVersionDate: 0,
  }

  const heroes = JSON.stringify(await generateData(generateHeroes, data));
  const items = JSON.stringify(await generateData(generateItems, data));
  const tips = JSON.stringify(await generateData(generateDotaTips, data));

  const patch_notes = JSON.stringify(await generateData(generatePatchNotes, data, dotaInfo));

  const current = await generateData(generateInfo, null, dotaInfo)

  if(!heroes || !items || !tips || !patch_notes || !current) return null
  else return { heroes, items, tips, patch_notes, current }
}

async function generateData (generator, data, extra) {
  // debug individual assets -- reduces compile times
  if(skip && skip.includes(generator.name)) return {}

  try {
    return await generator(data, extra)
  } catch(e) {
    logger.error(`error: while generating ${generator.name}`, e)
    return null
  }
}