export const images = {
  mana: 'http://cdn.dota2.com/apps/dota2/images/tooltips/mana.png',
  cooldown: 'http://cdn.dota2.com/apps/dota2/images/tooltips/cooldown.png',

  strength: 'http://cdn.dota2.com/apps/dota2/images/heropedia/overviewicon_str.png',
  agility: 'http://cdn.dota2.com/apps/dota2/images/heropedia/overviewicon_agi.png',
  intelligence: 'http://cdn.dota2.com/apps/dota2/images/heropedia/overviewicon_int.png',

  damage: 'http://cdn.dota2.com/apps/dota2/images/heropedia/overviewicon_attack.png',
  movespeed: 'http://cdn.dota2.com/apps/dota2/images/heropedia/overviewicon_speed.png',
  armor: 'http://cdn.dota2.com/apps/dota2/images/heropedia/overviewicon_defense.png',


  /* base for ability image */
  base_abilities:'http://cdn.dota2.com/apps/dota2/images/abilities/$ID_hp1.png',
  /* base for item image */
  base_items: 'http://cdn.dota2.com/apps/dota2/images/items/$ID_lg.png',
  
  base_hero_vert: 'http://cdn.dota2.com/apps/dota2/images/heroes/$ID_vert.jpg',
  base_hero_full: 'http://cdn.dota2.com/apps/dota2/images/heroes/$ID_full.png',
  base_hero_small: 'http://cdn.dota2.com/apps/dota2/images/heroes/$ID_hphover.png',



  /* images: hero + tower + roshan + default */
  npc_img: 'https://github.com/dotabuff/d2vpkr/tree/master/dota/resource/flash3/images',
  /* images: hero + misc */
  npc_img_hero: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/flash3/images/heroes/$ID.png',
  npc_img_hero_vert: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/flash3/images/heroes/selection/npc_dota_hero_$ID.png',
  npc_img_hero_mini: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/flash3/images/miniheroes/$ID.png',
  /* abilities */
  npc_img_ability: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/flash3/images/spellicons/$ID.png',
  /* attributes: agi int str || roles: baby cary dire disa escape gank init jung push radiant roam tank */
  npc_img_pip: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/flash3/images/heroes/selection/pip_$ID.png',
  /* items */
  npc_img_items: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/flash3/images/items/$ID.png',
}

export const data_url = {
  // game version and patch notes
  odota_gameversion: 'https://github.com/odota/dotaconstants/blob/master/json/patch.json',
  patch_notes: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/panorama/localization/patchnotes/patchnotes_english.txt',
  /* game files*/
  /* heroes - just tags */
  npc_activeHeroes: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/scripts/npc/activelist.json',
  //npc_activeHeroes: 'https://github.com/dotabuff/d2vpkr/blob/master/dota/scripts/npc/activelist.json',

  /* heroes - functionality */
  /* dotabuff API - heroes
  - looks up: ability names, hero stats
  */
  npc_heroes: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/scripts/npc/npc_heroes.json',
  //npc_heroes: 'https://github.com/dotabuff/d2vpkr/blob/master/dota/scripts/npc/npc_heroes.json',
  /* hero abilities - functionality */
  npc_abilities: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/scripts/npc/npc_abilities.json',
  //npc_itemBuilds: 'https://github.com/dotabuff/d2vpkr/tree/master/dota/itembuilds',
  npc_itemBuilds: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/itembuilds.json',

  /* lores, tips, items - descriptions */
  npc_dota: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/dota_english.json',
  /* unit - creeps, spirit bear, visage familiars */
  npc_units: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/scripts/npc/npc_units.json',
  
  /* items - functional */
  //npc_items: 'https://github.com/dotabuff/d2vpkr/blob/master/dota/scripts/npc/items.json',
  npc_items: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/scripts/npc/items.json',
  

  /* dota API - items
  - looks up: description, name, properties
  */
  items: 'http://www.dota2.com/jsfeed/heropediadata?feeds=itemdata&l=english',
}


// https://flatuicolors.com/palette/defo
export const colors = {
  open_dota_background: '#2E2D45',
  open_dota_background_gradient: 'background-color: rgb(25, 32, 35); background-image: linear-gradient(135deg, rgb(46, 45, 69), rgb(28, 33, 39));',
  
  physical: '#e74c3c',
  magical: '#3498db',
  pure: '#9b59b6',
  
  pierces: '#2ecc71',
  piercesNo: '#e74c3c',
  
  ability_property: '#bdc3c7',

  aghs: '#3498db',
}
export const addColor = (text, color='#bdc3c7') => `<font color="${color}">${text}</font>`

export const HeroConstants = {
  DOTA_ATTRIBUTE_AGILITY: 'Agility',
  DOTA_ATTRIBUTE_STRENGTH: 'Strength',
  DOTA_ATTRIBUTE_INTELLECT: 'Intelligence',

  DOTA_UNIT_CAP_MELEE_ATTACK: 'Melee',
  DOTA_UNIT_CAP_RANGED_ATTACK: 'Ranged',
}
export const AbilityConstants = {
  DOTA_PREFIX: 'DOTA_Tooltip_ability_',

  SPELL_IMMUNITY_ALLIES_NO: addColor('No', colors.piercesNo),
  SPELL_IMMUNITY_ALLIES_YES: addColor('Yes', colors.pierces),
  SPELL_IMMUNITY_ENEMIES_NO: addColor('No', colors.piercesNo),
  SPELL_IMMUNITY_ENEMIES_YES: addColor('Yes', colors.pierces),

  SPELL_DISPELLABLE_YES_STRONG: 'Yes, strong dispell',
  SPELL_DISPELLABLE_YES: 'Yes',
  SPELL_DISPELLABLE_NO: 'No',

  affects: {
    // AbilityUnitTargetTeam
    team: {
      DOTA_UNIT_TARGET_TEAM_FRIENDLY: 'Allied',
      DOTA_UNIT_TARGET_TEAM_ENEMY: 'Enemy',
      DOTA_UNIT_TARGET_TEAM_BOTH: 'Units',
    },
    
    // AbilityUnitTargetType
    unitType: {
      DOTA_UNIT_TARGET_HERO: 'Heroes',
      DOTA_UNIT_TARGET_BASIC: 'Creeps',
      DOTA_UNIT_TARGET_BUILDING: 'Buildings',
      DOTA_UNIT_TARGET_CUSTOM: 'Units',
      DOTA_UNIT_TARGET_CREEP: 'Creeps',
    }
  },

  damageType: {
    DAMAGE_TYPE_MAGICAL: addColor('Magical', colors.magical),
    DAMAGE_TYPE_PHYSICAL: addColor('Physical', colors.physical),
    DAMAGE_TYPE_PURE: addColor('Pure', colors.pure),

    // techies_minefield_sign
    DAMAGE_TYPE_NONE: ''
  },

  behavior: {
    DOTA_ABILITY_BEHAVIOR_POINT: 'Point Target',
    DOTA_ABILITY_BEHAVIOR_NO_TARGET: 'No Target',
    DOTA_ABILITY_BEHAVIOR_UNIT_TARGET: 'Unit Target',
    
    DOTA_ABILITY_BEHAVIOR_PASSIVE: 'Passive',
    DOTA_ABILITY_BEHAVIOR_CHANNELLED: 'Channeled',
    DOTA_ABILITY_BEHAVIOR_TOGGLE: 'Toggle',

    DOTA_ABILITY_BEHAVIOR_AURA: 'Aura',
    DOTA_ABILITY_BEHAVIOR_AUTOCAST: 'Auto-Cast',
    
    DOTA_ABILITY_BEHAVIOR_AOE: 'AOE',
    DOTA_ABILITY_BEHAVIOR_DIRECTIONAL: 'Directional',
  }
}

export const ItemConstants = {
  DOTA_PREFIX: 'item_',
  DOTA_ITEM_DISASSEMBLE_ALWAYS: "Yes",
  DOTA_ITEM_DISASSEMBLE_NEVER: "No",
}