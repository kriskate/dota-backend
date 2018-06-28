import { logger, fetchJSON, fs, fetchTXT } from "../utils/utils"

export const getRawData = async () => {
  try {
    return {
      odota_gameversion: await fetchJSON('odota_gameversion'),
      npc_patch_notes: await fetchTXT('npc_patch_notes'),

      npc_activeHeroes: await fetchJSON('npc_activeHeroes'),

      npc_heroes: await fetchJSON('npc_heroes'),
      npc_abilities: await fetchJSON('npc_abilities'),
      npc_popular_items: await fetchTXT('npc_popular_items'),
      npc_items: await fetchJSON('npc_items'),
      npc_dota: await fetchJSON('npc_dota'),
      
      dota2com_items: await fetchJSON('dota2com_items'),
    }
  } catch (e) {
    logger.error('error while gathering data', e)
    return null 
  }
}


export const createFile = async (fileName, folder, data) => {
  try {
    await fs.writeFileAsync(`${folder}/${fileName}.json`, JSON.stringify(data), 'utf8')

    logger.log('silly', `created file: ${fileName}.json`)
  } catch(e) {
    logger.error(`error while creating file: ${fileName}.json;`, e)
  }
}

export const checkSize = async (fileName, oldDataF, newDataF) => {
  try {
    if(!fs.existsSync(`${oldDataF}/${fileName}.json`)) throw new Error(`file ${fileName} does not exist`)
    
    let oldStat = await fs.statAsync(`${oldDataF}/${fileName}.json`)
    let newStat = await fs.statAsync(`${newDataF}/${fileName}.json`)
    
    if(!oldStat || !newStat) throw new Error('stats are not defined')

    logger.debug(`comparing ${fileName} size (${newStat.size}) to old file size (${oldStat.size}); ${oldStat.size !== newStat.size ? '!!! they are different' : 'they are the same.'}`)
    return oldStat.size !== newStat.size
    
  } catch(e) {
    logger.warn(`error while retrieving stats for old or new data; old: ${oldDataF}, new: ${newDataF}`, e)
    return true
  }
}
