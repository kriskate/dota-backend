import { logger, fetchJSON, fetchTXT, fetchHeroLore, timestamp } from "../utils/utils"
import { model_current } from "../data/models/model_wiki";
import { getLocalWiki } from "./wiki-versioning";

export const getRawData = async () => {
  try {
    return {
      odota_gameversion: await fetchJSON('odota_gameversion'),
      localization_abilities: await fetchJSON('localization_abilities'),
      localization_dota: await fetchJSON('localization_dota'),
      localization_hero_lore: await fetchHeroLore('localization_hero_lore'),
      localization_patch_notes: await fetchTXT('localization_patch_notes'),

      npc_activeHeroes: await fetchJSON('npc_activeHeroes'),

      npc_heroes: await fetchJSON('npc_heroes'),
      npc_abilities: await fetchJSON('npc_abilities'),

      npc_items: await fetchJSON('npc_items'),
      
      dota2com_items: await fetchJSON('dota2com_items'),
    }
  } catch (e) {
    logger.error('error while gathering data', e)
    return null 
  }
}

export const generateInfo = (data, { dotaVersion, dotaVersionDate }) => 
  model_current({
    appVersion: require('../package.json').version,
    dotaVersion,
    dotaVersionDate,
    wikiVersion: getLocalWiki().current.wikiVersion+1,
    wikiVersionDate: timestamp(),
  })