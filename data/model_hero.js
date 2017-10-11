export const Ability = ({tag, img, dname, affects, desc, notes, dmg, attrib, cmb, lore}) => {
  return {
    tag, img, affects, desc, notes, dmg, attrib, cmb, lore,
  }
}
export const Talent = ({tag, position, text, affects, desc}) => ({ 
  tag, affects, desc, position, text,  
})


export default (tag, name, bio, img_small, img_full, img_vert) => {
  return {
    // dota api - heropickerdata
    tag, name, bio,

    img_small, img_full, img_vert,

    // dota api - heropediadata - abilitydata
    Abilities: [], AbilitiesSpecial: [], Talents: [],

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