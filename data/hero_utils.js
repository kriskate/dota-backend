import { HeroConstants, data_url } from './constants'
import { generateAbilitiesAndTalents } from './ability_utils'
import model_hero from './models/model_hero'
import { logger, fetchRawTXT } from '../utils/utils';
import model_itembuilds from './models/model_itembuilds';


const itembuild_hack_counter_max_retries = 5;
let itembuild_hack_counter_current = 0;
export const generateHeroes = async ({ 
  npc_activeHeroes, npc_heroes, npc_abilities,
  localization_dota, localization_hero_lore, localization_abilities,
}) => {
  npc_heroes = npc_heroes.DOTAHeroes
  npc_abilities = npc_abilities.DOTAAbilities
  npc_activeHeroes = npc_activeHeroes.whitelist
  localization_dota = localization_dota.lang.Tokens
  localization_hero_lore = localization_hero_lore.lang.Tokens
  localization_abilities = localization_abilities.lang.Tokens

  const heroes = []
  await Promise.all(
  Object.keys(npc_activeHeroes).map(async npc_tag => {
    // there are some keys that are not actual heroes
    if(npc_activeHeroes[npc_tag] !== "1") return

    const npc_hero = npc_heroes[npc_tag]
    const tag = npc_tag.replace('npc_dota_hero_', '')
    
    itembuild_hack_counter_current = 0;
    const item_builds = await getItemBuilds(tag)

    const hero = new model_hero({
      tag,
      name: localization_dota[npc_tag],
      bio: localization_hero_lore[`${npc_tag}_bio`],
      hype: localization_dota[`${npc_tag}_hype`],
      item_builds,
    })

    hero.attributes.AttributePrimary = HeroConstants[hero.AttributePrimary]
    hero.attributes.AttackCapabilities = HeroConstants[hero.AttackCapabilities]

    Object.keys(hero.attributes).forEach(attribute => hero.attributes[attribute] = npc_hero[attribute] || hero.attributes[attribute])

    // get abilities and talents
    const abilities = generateAbilitiesAndTalents(tag, npc_hero, npc_abilities, localization_abilities)
    Object.keys(abilities).forEach(ability => {
      if(ability.length > 0) hero[ability] = abilities[ability]
    })


    heroes.push(hero)
  })
  )

  return heroes
}

const getItemBuilds = async (tag) => {
  try {
    const data = await fetchRawTXT(data_url.npc_itembuild(tag));
    return model_itembuilds(data);
  } catch(e) {
    logger.error(`getting current items for hero ${tag} failed; try #${itembuild_hack_counter_current}`, e)

    if(itembuild_hack_counter_current <= itembuild_hack_counter_max_retries) {
      itembuild_hack_counter_current ++;
      return await getItemBuilds(tag);
    }
    return null
  }
}