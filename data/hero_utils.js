import {Ability, Talent} from './model_hero'

export const extractHeroData = (hero, npc_hero, abilities_raw, img_abilities) => {

  // generate hero.Abilities and hero.Talents
  const {abilities, abilities_special, talents} = generateAbilitiesAndTalents(hero.tag, npc_hero, abilities_raw, img_abilities)
  hero.Abilities = abilities
  hero.AbilitiesSpecial = abilities_special
  hero.Talents = talents

  // dump the remaining props from npc_heroes
  Object.keys(hero).forEach(prop => {
    if(!hero[prop]) hero[prop] = npc_hero[prop]
  })
}

const excludedAbilities = ['monkey_king_primal_spring_early']
const specialAbilities = {
  invoker: ['invoker_cold_snap', 'invoker_ghost_walk', 'invoker_tornado', 'invoker_emp', 'invoker_alacrity', 'invoker_chaos_meteor', 'invoker_sun_strike', 'invoker_forge_spirit', 'invoker_ice_wall', 'invoker_deafening_blast']
}
const generateAbilitiesAndTalents = (hero_tag, npc_hero, abilities_raw, img_abilities) => {

  const abilities = [], abilities_special = [], talents = []

  Object.keys(npc_hero)
  // get all props named 'Ability#'
  .filter(prop => prop.substring(0, 7) === 'Ability' && !isNaN(prop.substring(7)))
  // parse them and check if it's an ability or a talent
  // raw_tag = Ability#
  .map((raw_tag, idx) => {
    // ability tag - antimage_blink
    const ability_tag = npc_hero[raw_tag]

    let talentStartsAt
    switch(hero_tag) {
      case 'rubick':
        talentStartsAt = 11
      break
      case 'invoker':
        talentStartsAt = 17
      break
      default:
        talentStartsAt = 10
    }

    let ability = abilities_raw[ability_tag]
    if(excludedAbilities.includes(ability_tag)) return
    if(parseInt(raw_tag.split('Ability')[1]) < talentStartsAt) {
      // ability is spell
      if(specialAbilities[hero_tag] && specialAbilities[hero_tag].includes(ability_tag)) {
        abilities_special.push(new Ability({ tag: ability_tag, ...ability, 
          img: img_abilities.replace('${ID}', ability_tag) }))
      } else {
        abilities.push(new Ability({ tag: ability_tag, ...ability, 
          img: img_abilities.replace('${ID}', ability_tag) }))
      }
    } else {
      // ability is talent
      talents.push(new Talent({ tag: ability_tag, ...ability,
        position: idx % 2 !== 0 ? 'left' : 'right' }))
    }
  })

  return {abilities, abilities_special, talents}
}
