import { logger, fetchJSON, fs } from "../utils/utils"
import { data_url } from "../data/constants"

export const getRawData = async () => {
  try {
    return {
      npc_heroes: await fetchJSON(data_url.npc_heroes),
      npc_abilities: await fetchJSON(data_url.npc_abilities),
      npc_items: await fetchJSON(data_url.npc_items),
      npc_dota: await fetchJSON(data_url.npc_dota),

      heroes_raw: await fetchJSON(data_url.heroes),
      abilities_raw: await fetchJSON(data_url.abilities),
      items_raw: await fetchJSON(data_url.items),
    }
  } catch (e) {
    logger.error('gathering data', e)
    return null 
  }
}


export const createFile = async (fileName, folder, data) => {
  try {
    await fs.writeFileAsync(`${folder}/${fileName}.json`, JSON.stringify(data), 'utf8')

    logger.info(`created raw data file: ${fileName}.json`)
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

    logger.info(`comparing newData size (${newStat.size}) to oldData size (${oldStat.size}); ${oldStat.size !== newStat.size ? '!!! they are different' : 'they are the same.'}`)
    return oldStat.size !== newStat.size
    
  } catch(e) {
    logger.error(`error while retrieving stats for old or new data; old: ${oldDataF}, new: ${newDataF}`, e)
    return true
  }
}
