export const Ability = ({ tag, img, name, affects, description, notes, attrib, cmb, lore, IsGrantedByScepter, HasScepterUpgrade }) => {
  return {
    tag, name, img, affects, description, notes, attrib, cmb, lore, IsGrantedByScepter, HasScepterUpgrade,
  }
}
export const Talent = ({tag, name, description, position }) => ({ 
  tag, name, description, position,
})


export default ({ tag, name, bio, hype, img_small, img_full, img_vert, popular_items }) => {
  return {
    // dota api - heropickerdata
    tag, name, bio, hype,

    // dota2.com images
    img_small, img_full, img_vert,
    
    popular_items,
    
    // abilities and talents
    abilities: [], 
    /* generate these only if needed
       in order to easier navigate to heroes with special abilities while searching for inconsistencies
    */
    /* abilities_special: [], abilities_aghs: [], abilities_hidden: [], */ 
    talents: [],

    // raw properties taken from npc_dota
    attributes: {
      // game files - npc_heroes - the default values are taken from npc_dota_hero_base
      AttributePrimary: "DOTA_ATTRIBUTE_STRENGTH",
      AttributeBaseAgility:  "0", AttributeAgilityGain:  "0",
      AttributeBaseStrength: "0", AttributeStrengthGain: "0",
      AttributeBaseIntelligence: "0", AttributeIntelligenceGain: "0",
  
      // base
      ArmorPhysical: "-1",
      MagicalResistance: "25",
  
      StatusHealth: "200",
      StatusHealthRegen: "1.5000",
      StatusMana: "75",
      StatusManaRegen: "0.9",
      
      MovementSpeed: "300",
      MovementTurnRate: "0.500000",
      
      VisionDaytimeRange: "1800",
      VisionNighttimeRange: "800",
      
      // attack
      AttackCapabilities: "DOTA_UNIT_CAP_RANGED_ATTACK",
      AttackDamageMin: "1",
      AttackDamageMax: "1",
      AttackRate: "1.700000",
      AttackAnimationPoint: "0.750000",
      AttackAcquisitionRange: "800",
      AttackRange: "600",
      ProjectileSpeed: "900",
      
      // playStyle
      Role: null, Rolelevels: null, Complexity: null,
      
      // other
      Team: null,
      HeroID: null,
    }
  }
}