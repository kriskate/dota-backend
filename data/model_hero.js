const Ability = ({tag, img, dname, affects, desc, notes, dmg, attrib, cmb, lore}) => {
  return {
    tag, img, affects, desc, notes, dmg, attrib, cmb, lore,
  }
}
const Talent = ({tag, position, text, affects, desc}) => ({ 
  tag, affects, desc, position, text,  
})

export const extractHeroData = (hero, npc_hero, abilities_raw, img_abilities) => {
  // generate hero.Abilities and hero.Talents
  generateAbilitiesAndTalents(hero, npc_hero, abilities_raw, img_abilities)

  // dump the remaining props from npc_heroes
  Object.keys(hero).forEach(prop => {
    if(!hero[prop]) hero[prop] = npc_hero[prop]
  })
}
const generateAbilitiesAndTalents = (hero, npc_hero, abilities_raw, img_abilities) => {
  const abilities = [], talents = []

  // get all props named 'Ability#'
  Object.keys(npc_hero)
  .filter(prop => prop.substring(0, 7) === 'Ability' && !isNaN(prop.substring(7)))
  // parse them and check if it's an ability or a talent
  .map((raw_tag, idx) => {
    const tag = npc_hero[raw_tag]
    let talentStartsAt
    switch(hero.tag) {
      case 'rubick':
        talentStartsAt = 11
      break
      case 'invoker':
        talentStartsAt = 17
      break
      default:
        talentStartsAt = 10
    }

    let ability = abilities_raw[tag]
    if(parseInt(raw_tag.split('Ability')[1]) < talentStartsAt) {
      // ability is spell
      abilities.push(new Ability({ tag, ...ability, 
        img: img_abilities.replace('${ID}', tag) }))
    } else {
      // ability is talent
      talents.push(new Talent({ tag, ...ability,
        position: idx % 2 !== 0 ? 'left' : 'right' }))
    }
  })

  hero.Abilities = abilities
  hero.Talents = talents
}

const ATTRIBUTES = {
  strength: 'DOTA_ATTRIBUTE_STRENGTH',
  agility: 'DOTA_ATTRIBUTE_AGILITY',
  intelligence: 'DOTA_ATTRIBUTE_INTELLECT',
}

export default (tag, name, bio, img_small, img_full, img_vert) => {
  return {
    // dota api - heropickerdata
    tag, name, bio,

    img_small, img_full, img_vert,

    // dota api - heropediadata - abilitydata
    Abilities: [], Talents: [],

    // dotabuff api - npc_heroes
    AttributePrimary: null,
    AttributeBaseAgility: null, AttributeAgilityGain: null,
    AttributeBaseStrength: null, AttributeStrengthGain: null,
    AttributeBaseIntelligence: null, AttributeIntelligenceGain: null,

    // base
    ArmorPhysical: null,
    StatusHealthRegen: null,
    MovementSpeed: null,
    MovementTurnRate: null,

    // attack
    AttackCapabilities: null,
    AttackDamageMin: null,
    AttackDamageMax: null,
    AttackRate: null,
    AttackRange: null,
    ProjectileSpeed: null,

    // playStyle
    Role: null, Rolelevels: null, Complexity: null,
  }
}