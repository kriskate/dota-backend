import { images, HeroConstants } from './constants'
import { generateAbilitiesAndTalents } from './ability_utils'
import model_hero from '../data/model_hero'


export const generateHeroes = ({ heroes_raw, npc_heroes, npc_abilities, npc_dota }) => {
  npc_heroes = npc_heroes.DOTAHeroes

  const heroes = []
  Object.keys(heroes_raw).forEach(tag => {
    const hero_raw = heroes_raw[tag]
    const npc_hero = npc_heroes[`npc_dota_hero_${tag}`]
    const hero = new model_hero(
      tag, hero_raw.name, hero_raw.bio,
      images.base_hero_small.replace('$ID', tag),
      images.base_hero_full.replace('$ID', tag),
      images.base_hero_vert.replace('$ID', tag)
    )

    // extract data for this hero
    extractHeroData(hero, npc_hero, npc_abilities.DOTAAbilities, npc_dota.lang.Tokens)

    heroes.push(hero)
  })

  return heroes
}


const extractHeroData = (hero, npc_hero, npc_abilities, npc_dota) => {

  // generate hero.Abilities and hero.Talents
  const { abilities, abilities_special, abilities_aghs, abilities_hidden, talents } = generateAbilitiesAndTalents(hero.tag, npc_hero, npc_abilities, npc_dota)

  if(abilities_special.length > 0) hero.AbilitiesSpecial = abilities_special
  if(abilities_hidden.length > 0) hero.AbilitiesHidden = abilities_hidden
  if(abilities_aghs.length > 0) hero.AbilitiesAghs = abilities_aghs

  hero.Abilities = abilities
  hero.Talents = talents

  // dump the remaining props from npc_heroes
  Object.keys(hero).forEach(prop => {
    if (!hero[prop]) hero[prop] = npc_hero[prop]
  })
  hero.AttributePrimary = HeroConstants[hero.AttributePrimary]
  hero.AttackCapabilities = HeroConstants[hero.AttackCapabilities]
}
