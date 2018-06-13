import { AbilityConstants, images, addColor, colors } from './constants'
import { Ability, Talent } from './model_hero'


// excluded abilities do not have enough data to be relevant as actual abilities
const excludedAbilities = [
  'generic_hidden',
  'bane_nightmare_end',
  'monkey_king_primal_spring_early', 
  'morphling_morph',
  'rubick_hidden1', 'rubick_hidden2', 'rubick_hidden3'
]
// special abilities are non-standard abilities
const specialAbilities = {
  brewmaster: {
    earth: ['brewmaster_earth_hurl_boulder', 'brewmaster_earth_spell_immunity', 'brewmaster_earth_pulverize'], 
    storm: ['brewmaster_storm_dispel_magic', 'brewmaster_storm_cyclone', 'brewmaster_storm_wind_walk'], 
    fire: ['brewmaster_fire_permanent_immolation'] 
  },
  phoenix: ['phoenix_sun_ray_toggle_move'],
  invoker: ['invoker_cold_snap', 'invoker_ghost_walk', 'invoker_tornado', 'invoker_emp', 'invoker_alacrity', 'invoker_chaos_meteor', 'invoker_sun_strike', 'invoker_forge_spirit', 'invoker_ice_wall', 'invoker_deafening_blast'],
  lone_druid: {
    bear: ['lone_druid_spirit_bear_return', 'lone_druid_spirit_bear_entangle', 'lone_druid_spirit_bear_demolish', ],
    aghsIn: 'lone_druid_true_form_druid',
  },
  spirit_breaker: 'spirit_breaker_empowering_haste',
  /* not needed, description in visage_stone_form_self_cast */ /* visage: 'visage_summon_familiars_stone_form' */
}

/* generates abilities, special abilities and talents */
export const generateAbilitiesAndTalents = (hero_tag, npc_hero, npc_abilities, npc_dota) => {

  const abilities = [], abilities_aghs = [], abilities_special = [], abilities_hidden = [], talents = []

  const talentStartsAt = npc_hero.AbilityTalentStart || 10

  Object.keys(npc_hero)
    // get all props named 'Ability#'
    .filter(prop => prop.substring(0, 7) === 'Ability' && !isNaN(prop.substring(7)))
    // parse them and check if it's an ability or a talent
    // raw_tag = Ability#
    .map((raw_tag, idx) => {
      // ability tag - antimage_blink
      const ability_tag = npc_hero[raw_tag]
      
      
      if (excludedAbilities.includes(ability_tag)) return
      
      if (parseInt(raw_tag.split('Ability')[1]) < talentStartsAt) {
        // ability is spell
        const npc_ability = npc_abilities[ability_tag]
        
        let new_ability = new Ability({
          tag: ability_tag,
          img: images.base_abilities.replace('$ID', ability_tag)
        })


        const abilityKeys = getAbilityKeys(ability_tag, npc_ability, npc_dota)

        new_ability.name = abilityKeys.name
        new_ability.description = `
        ${abilityKeys.description}<br/><br/>
        ${!abilityKeys.aghanim ? '' : addColor(`Aghanim's Scepter Upgrade: ${abilityKeys.aghanim}`, colors.aghs)}
        `.replace(/\s+/g, ' ')
        
        const abillityAffects = getAbilityAffects(npc_ability)
        new_ability.affects = `
          ${!npc_ability.IsGrantedByScepter ? '' : addColor(`Requires Aghanim's Scepter to unlock.`)}
          ABILITY: ${getAbilityBehavior(npc_ability)}<br />
          ${!abillityAffects ? '' 
            : `AFFECTS: ${abillityAffects}<br />`}
          ${!npc_ability.AbilityUnitDamageType || !AbilityConstants.damageType[npc_ability.AbilityUnitDamageType] ? '' 
            : `DAMAGE TYPE: ${AbilityConstants.damageType[npc_ability.AbilityUnitDamageType]}<br />`}
          ${!npc_ability.SpellImmunityType ? '' 
            : `PIERCES SPELL IMMUNITY: ${AbilityConstants[npc_ability.SpellImmunityType]}<br />`}
          ${!npc_ability.SpellDispellableType ? '' 
            : `DISPELLABLE: ${AbilityConstants[npc_ability.SpellDispellableType]}`}
        `.replace(/\s+/g, ' ')

        new_ability.notes = abilityKeys.notes.join('<br/>')

        new_ability.attrib = abilityKeys.special.join('<br/>')
        new_ability.cmb = `
          ${!npc_ability.AbilityManaCost ? '' : `<img src=${images.mana} width=\"16\" height=\"16\" border=\"0\" /> ${npc_ability.AbilityManaCost} <br/>`}
          ${!npc_ability.AbilityCooldown ? '' : `<img src=${images.cooldown} width=\"16\" height=\"16\" border=\"0\" />${npc_ability.AbilityCooldown}<br/>`}
        `.replace(/\s+/g, ' ')

        new_ability.lore = abilityKeys.lore

        new_ability.HasScepterUpgrade = npc_ability.HasScepterUpgrade
        new_ability.IsGrantedByScepter = npc_ability.IsGrantedByScepter

        // some abilities are special, like invoker's invoked spells
        if (hero_tag == 'invoker' && specialAbilities[hero_tag].includes(ability_tag))
          abilities_special.push(new_ability)
        else if(npc_ability.AbilityBehavior && npc_ability.AbilityBehavior.includes('DOTA_ABILITY_BEHAVIOR_HIDDEN')){
          new_ability.IsGrantedByScepter
            ? abilities_aghs.push(new_ability)
            : abilities_hidden.push(new_ability)
        } else
          abilities.push(new_ability)

      } else {
        // ability is talent

        let talent = new Talent({
          tag: ability_tag,
          name: npc_dota[`DOTA_Tooltip_ability_${ability_tag}`],
          position: idx % 2 !== 0 ? 'left' : 'right',
          description: npc_dota[`DOTA_Tooltip_ability_${ability_tag}_Description`] || '',
        })
        talents.push(talent)
      }
    })

  return { abilities, abilities_aghs, abilities_special, abilities_hidden, talents }
}



export const getAbilityKeys = (ability_tag, npc_ability, npc_dota) => {
  let name, description, aghanim, lore, notes = [], special = []

  Object.keys(npc_dota).forEach(key => {
    const isKeyForAbility = new RegExp(`DOTA_Tooltip_ability_${ability_tag}`).test(key)
    if (!isKeyForAbility) return

    // name
    if (key == `DOTA_Tooltip_ability_${ability_tag}`) name = npc_dota[key]
    // notes
    else if (key.includes(`DOTA_Tooltip_ability_${ability_tag}_Note`)) notes.push(npc_dota[key])
    // lore
    else if (key == `DOTA_Tooltip_ability_${ability_tag}_Lore`) lore = npc_dota[key]
    // aghs
    else if (key == `DOTA_Tooltip_ability_${ability_tag}_aghanim_description`) 
      aghanim = replaceWithAbilitySpecial(npc_dota[key], npc_ability, ability_tag)
    // description
    else if (key == `DOTA_Tooltip_ability_${ability_tag}_Description`) 
      description = replaceWithAbilitySpecial(npc_dota[key], npc_ability, ability_tag)
    // special
    else {
      let ability_special_value = getAbilitySpecialValue(npc_ability, ability_tag, key)
      if(ability_special_value !== null) special.push(`${npc_dota[key]} ${ability_special_value}`)
    }
  })
  return { name, description, aghanim, lore, notes, special }
}

const getAbilitySpecialValue = (npc_ability, ability_tag, ability_key, cns) => {
  if(!npc_ability.AbilitySpecial) return null
  
  let toR = null
  // HACK - broken_arr - spirit_breaker_empowering_haste does not have AbilitySpecial as an array, but as an object
  const broken_arr = ability_tag == specialAbilities.spirit_breaker
  const ability_special_arr = broken_arr ? Object.keys(npc_ability.AbilitySpecial) : npc_ability.AbilitySpecial

  const tkey = ability_key.replace(`DOTA_Tooltip_ability_${ability_tag}_`, '')
  ability_special_arr.forEach(a_s => {
    if(broken_arr) a_s = npc_ability.AbilitySpecial[a_s]

    if (Object.keys(a_s)[0] == tkey) {
      toR = a_s[tkey]
      return
    }
  })
  // HACK - to-do: (optimisation of a few seconds parse) reverse parse AbilitySpecial, and take these into account when getting abilityKeys
  // at the moment, abilityKeys contain other ability keys too
  if(toR == null) return null
  else return addColor(toR)
}


// replace inline %ability_special_property% with it's corresponding AbilitySpecial field
const replaceWithAbilitySpecial = (str, npc_ability, ability_tag) => {
  let toR = str, m
  const propsregex = /%.*?%/g, props = []

  while ((m = propsregex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === propsregex.lastIndex) propsregex.lastIndex++
      
      // The result can be accessed through the `m`-variable.
      props.push(...m)
  }
  props.forEach(prop => {
    const parsedProp = prop.replace(/%/g, '')
    if(!parsedProp) return

    const ability_special_value = getAbilitySpecialValue(npc_ability, ability_tag, parsedProp, true)
    if(ability_special_value !== null) toR = toR.replace(prop, ability_special_value)
  })

  return toR
}



export const getAbilityBehavior = (npc_ability) => Object.keys(AbilityConstants.behavior).reduce((behaviors, behavior, idx) => {
  // abilities always have behaviors
  const comma = !behaviors ? '' : ', '
  const addBehavior = npc_ability.AbilityBehavior.includes(behavior) ? comma + AbilityConstants.behavior[behavior] : ''
  return behaviors + addBehavior
}, '')



export const getAbilityAffects = (npc_ability) => {
  let affected = ''

  const unit = (team) => {
    Object.keys(AbilityConstants.affects.unitType).forEach(unitType => {
      const comma = !affected ? '' : ', '
      if (npc_ability.AbilityUnitTargetType && npc_ability.AbilityUnitTargetType.includes(unitType)) affected += comma + team + ' ' + AbilityConstants.affects.unitType[unitType]
    })
  }
  Object.keys(AbilityConstants.affects.team).forEach(team => {
    if (npc_ability.AbilityUnitTargetTeam && npc_ability.AbilityUnitTargetTeam.includes(team)) unit(AbilityConstants.affects.team[team])
  })

  return affected
}