import { logger, fs, fetcher, fetcher_TYPES } from "../utils/utils"
import { current, getNew } from "./wiki-versioning";

export const getRawData = async (lg) => {
  try {
    return {
      localization_abilities: await fetcher(fetcher_TYPES.JSON, 'localization_abilities', lg),
      localization_dota: await fetcher(fetcher_TYPES.JSON, 'localization_dota', lg),
      localization_hero_lore: await fetcher(fetcher_TYPES.HeroLore, 'localization_hero_lore', lg),
      localization_patch_notes: await fetcher(fetcher_TYPES.TXT, 'localization_patch_notes', lg),

      npc_activeHeroes: await fetcher(fetcher_TYPES.JSON, 'npc_activeHeroes'),

      npc_heroes: await fetcher(fetcher_TYPES.JSON, 'npc_heroes'),
      npc_abilities: await fetcher(fetcher_TYPES.JSON, 'npc_abilities'),

      npc_items: await fetcher(fetcher_TYPES.JSON, 'npc_items'),
      
      dota2com_items: await fetcher(fetcher_TYPES.JSON, 'dota2com_items', lg),
    }
  } catch (e) {
    logger.error('error while gathering data', e)
    return null 
  }
}


export const createFile = async (fileName, folder, data, ext='json', stringify=true) => {
  try {
    await fs.writeFileAsync(`${folder}/${fileName}.${ext}`, stringify ? JSON.stringify(data) : data, 'utf8')

    logger.log('silly', `created file: ${fileName}.${ext}`)
  } catch(e) {
    logger.error(`error while creating file: ${fileName}.${ext}`, e)
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