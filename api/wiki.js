

import {fs, logger, fetchJSON, rimraf, timestamp} from '../utils/utils'
import {VERSIONF_BASE, VERSIONF_PREFIX, currentWikiVersion, currentWikiVersionDate, incrementWikiVersion} from './wiki-versioning'

import model_hero from '../data/model_hero'
import {extractHeroData} from '../data/hero_utils'
import model_item from '../data/model_item'

const url = {
/* game files*/
  /* heroes - just tags */
  npc_activeHeroes: 'https://github.com/dotabuff/d2vpkr/blob/master/dota/scripts/npc/activelist.json',
  /* heroes - functionality */
  npc_heroes: 'https://github.com/dotabuff/d2vpkr/blob/master/dota/scripts/npc/npc_heroes.json',
  /* hero abilities - functionality */
  npc_abilities: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/scripts/npc/npc_abilities.json',
  npc_itemBuilds: 'https://github.com/dotabuff/d2vpkr/tree/master/dota/itembuilds',

  /* lores, tips, items - descriptions */
  npc_dota_english: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/dota_english.json',
  /* unit - creeps, spirit bear, visage familiars */
  npc_units: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/scripts/npc/npc_units.json',

  /* items - functional */
  npc_items: 'https://github.com/dotabuff/d2vpkr/blob/master/dota/scripts/npc/items.json',

  /* images: hero + tower + roshan + default */
  npc_img: 'https://github.com/dotabuff/d2vpkr/tree/master/dota/resource/flash3/images',
  /* images: hero + misc */
  npc_img_hero: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/flash3/images/heroes/$ID.png',
  npc_img_hero_vert: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/flash3/images/heroes/selection/npc_dota_hero_$ID.png',
  npc_img_hero_mini: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/flash3/images/miniheroes/$ID.png',
  /* abilities */
  npc_img_ability: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/flash3/images/spellicons/$ID.png',
  /* agi int str / baby cary dire disa escape gank init jung push radiant roam tank */
  npc_img_pip: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/flash3/images/heroes/selection/pip_$ID.png',
  /* items */
  npc_img_items: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/flash3/images/items/$ID.png',
  


  /* dota API - heroes
  - looks up: tag, name, bio
  */
  heroes: 'http://www.dota2.com/jsfeed/heropickerdata?&l=english',
  /* dotabuff API - heroes
  - looks up: ability names, hero stats
  */
  heroes_long: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/scripts/npc/npc_heroes.json',
  /* dota API - hero abilities
  - looks up: description
  */
  abilities: 'http://www.dota2.com/jsfeed/heropediadata?feeds=abilitydata&l=english',
  /* dota API - items
  - looks up: description, name, properties
  */
  items: 'http://www.dota2.com/jsfeed/heropediadata?feeds=itemdata&l=english',

  /* base for ability image */
  img_abilities:'http://cdn.dota2.com/apps/dota2/images/abilities/${ID}_hp1.png',
  /* base for item image */
  img_items: 'http://cdn.dota2.com/apps/dota2/images/items/${ID}_lg.png',
  

  img_hero_vert: 'http://cdn.dota2.com/apps/dota2/images/heroes/${ID}_vert.jpg',
  img_hero_full: 'http://cdn.dota2.com/apps/dota2/images/heroes/${ID}_full.png',
  img_hero_small: 'http://cdn.dota2.com/apps/dota2/images/heroes/${ID}_hphover.png',

}



const getRawData = async () => {
  try {
    return {
      heroes_raw: await fetchJSON(url.heroes),
      npc_heroes_raw: await fetchJSON(url.heroes_long),
      abilities_raw: await fetchJSON(url.abilities),
      items_raw: await fetchJSON(url.items),
    }
  } catch (e) {
    logger.error('gathering data', e)
    return null 
  }
}

const createFile = async (fileName, folder, data) => {
  try {
    await fs.writeFileAsync(`${folder}/${fileName}.json`, JSON.stringify(data), 'utf8')

    logger.info(`created raw data file: ${fileName}.json`)
  } catch(e) {
    logger.error(`error while creating file: ${fileName}.json;`, e)
  }
}

const checkSize = async (fileName, oldDataF, newDataF) => {
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


/* --- EXPORTED METHODS --- */

/* creates a new folder containing the data gathered from the APIs 
 * and keeps it while updating the current version if ** conditions are met
*/
export const gatherData = async () => {
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
    const parsedData = await updateData(allData, newDataF)
    
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
const updateData = async (data, newDataF) => {
  let heroes = await generateHeroes(data, newDataF)
  let items = await generateItems(data, newDataF)

  if(!heroes || !items) return null
  else return {heroes, items}
}


const generateItems = async (data, newDataF) => {
  try {
    const {items_raw} = data
    const items = []

    Object.keys(items_raw.itemdata).forEach(tag => {
      items.push(new model_item({
        tag, ...items_raw.itemdata[tag],
        img: url.img_items.replace('${ID}', tag),
      }))
    })

    logger.info(`creating parsed items data, ${newDataF}/items.json`)
    createFile('items', newDataF, items)

    return items
  } catch(e) {
    logger.error('error: while generating items.json', e)
    return null
  }
}


const generateHeroes = async (data, newDataF) => {
  try {
    const {heroes_raw, npc_heroes_raw, abilities_raw, items_raw} = data

    const heroes = []
    Object.keys(heroes_raw).forEach(tag => {
      const hero_raw = heroes_raw[tag]
      const npc_hero = npc_heroes_raw.DOTAHeroes[`npc_dota_hero_${tag}`]
      const hero = new model_hero(
        tag, hero_raw.name, hero_raw.bio,
        url.img_hero_small.replace('${ID}', tag),
        url.img_hero_full.replace('${ID}', tag),
        url.img_hero_vert.replace('${ID}', tag)
      )

      // extract data for this hero
      extractHeroData(hero, npc_hero, abilities_raw.abilitydata, url.img_abilities)

      heroes.push(hero)
    })

    logger.info(`creating parsed hero data, ${newDataF}/heroes.json`)
    createFile('heroes', newDataF, heroes)
    return heroes
  } catch(e) {
    logger.error('error: while generating heroes.json', e)
    return null
  }
}

/* --- end EXPORTED METHODS --- */