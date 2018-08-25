import { images, HeroConstants } from './constants'
import { generateAbilitiesAndTalents } from './ability_utils'
import model_hero from '../data/model_hero'
import { logger } from '../utils/utils';

export const generateHeroes = ({ npc_heroes, npc_abilities, npc_dota, npc_popular_items }) => {
  npc_heroes = npc_heroes.DOTAHeroes
  npc_dota = npc_dota.lang.Tokens
  npc_abilities = npc_abilities.DOTAAbilities
  npc_popular_items = npc_popular_items.DOTAHeroes

  const heroes = []

  Object.keys(npc_heroes).forEach(npc_tag => {
    // there are some keys that are not actual heroes
    if(['Version', 'npc_dota_hero_base', 'npc_dota_hero_target_dummy'].includes(npc_tag)) return

    const npc_hero = npc_heroes[npc_tag]
    const tag = npc_tag.replace('npc_dota_hero_', '')
    
    
    const hero = new model_hero({
      tag,
      name: npc_dota[npc_tag],
      bio: npc_dota[`${npc_tag}_bio`],
      hype: npc_dota[`${npc_tag}_hype`],
      popular_items: getPopularItems(npc_popular_items, npc_tag),
      img_small: images.base_hero_small.replace('$ID', tag),
      img_full: images.base_hero_full.replace('$ID', tag),
      img_vert: images.base_hero_vert.replace('$ID', tag),
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

  return heroes
}

const getPopularItems = (npc_popular_items, npc_tag) => {
  try {
    return Object.keys(npc_popular_items[npc_tag].popular_items).map(item => item)
  } catch(e) {
    logger.warn(`getting current items for hero ${npc_tag} failed`, e)
    return []
  }
}