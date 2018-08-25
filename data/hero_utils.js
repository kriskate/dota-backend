import { HeroConstants, data_url } from './constants'
import { generateAbilitiesAndTalents } from './ability_utils'
import model_hero from '../data/model_hero'
import { logger, fetchRawTXT } from '../utils/utils';
import model_itembuilds from './model_itembuilds';

export const generateHeroes = async ({ npc_heroes, npc_abilities, npc_dota }) => {
  npc_heroes = npc_heroes.DOTAHeroes
  npc_dota = npc_dota.lang.Tokens
  npc_abilities = npc_abilities.DOTAAbilities

  const heroes = []
  await Promise.all(
  Object.keys(npc_heroes).map(async npc_tag => {
    // there are some keys that are not actual heroes
    if(['Version', 'npc_dota_hero_base', 'npc_dota_hero_target_dummy'].includes(npc_tag)) return

    const npc_hero = npc_heroes[npc_tag]
    const tag = npc_tag.replace('npc_dota_hero_', '')
    
    const item_builds = await getItemBuilds(tag)
    const hero = new model_hero({
      tag,
      name: npc_dota[npc_tag],
      bio: npc_dota[`${npc_tag}_bio`],
      hype: npc_dota[`${npc_tag}_hype`],
      item_builds,
    })

    hero.attributes.AttributePrimary = HeroConstants[hero.AttributePrimary]
    hero.attributes.AttackCapabilities = HeroConstants[hero.AttackCapabilities]

    Object.keys(hero.attributes).forEach(attribute => hero.attributes[attribute] = npc_hero[attribute] || hero.attributes[attribute])

    // get abilities and talents
    const abilities = generateAbilitiesAndTalents(tag, npc_hero, npc_abilities, npc_dota)
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
    logger.warn(`getting current items for hero ${tag} failed`, e)
    return {}
  }
}