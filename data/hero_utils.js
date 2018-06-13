import { images, HeroConstants } from './constants'
import { generateAbilitiesAndTalents } from './ability_utils'
import model_hero from '../data/model_hero'


export const generateHeroes = ({ heroes_raw, npc_heroes, npc_abilities, npc_dota }) => {
  npc_heroes = npc_heroes.DOTAHeroes
  npc_dota = npc_dota.lang.Tokens
  npc_abilities = npc_abilities.DOTAAbilities

  const heroes = []

  Object.keys(npc_heroes).forEach(tag => {
    // there are some keys that are not actual heroes
    if(['Version', 'npc_dota_hero_base', 'npc_dota_hero_target_dummy'].includes(tag)) return

    const npc_hero = npc_heroes[tag]
    const hero_tag = tag.replace('npc_dota_hero_', '')
    
    
    const hero = new model_hero({
      tag: hero_tag,
      name: npc_dota[tag],
      bio: npc_dota[`${tag}_bio`],
      hype: npc_dota[`${tag}_hype`],
      img_small: images.base_hero_small.replace('$ID', tag),
      img_full: images.base_hero_full.replace('$ID', tag),
      img_vert: images.base_hero_vert.replace('$ID', tag),
    })

    hero.AttributePrimary = HeroConstants[hero.AttributePrimary]
    hero.AttackCapabilities = HeroConstants[hero.AttackCapabilities]

    Object.keys(hero.attributes).forEach(attribute => hero.attributes[attribute] = npc_hero[attribute] || hero.attributes[attribute])
    // get abilities and talents
    const abilities = generateAbilitiesAndTalents(hero.tag, npc_hero, npc_abilities, npc_dota)
    Object.keys(abilities).forEach(ability => {
      if(ability.length > 0) hero[ability] = abilities[ability]
    })


    heroes.push(hero)
  })

  return heroes
}