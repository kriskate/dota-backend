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
  // npc_img: 'https://github.com/dotabuff/d2vpkr/tree/master/dota/resource/flash3/images',
  /* images: hero + misc */
  // npc_img_hero: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/flash3/images/heroes/$ID.png',
  // npc_img_hero_vert: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/flash3/images/heroes/selection/npc_dota_hero_$ID.png',
  // npc_img_hero_mini: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/flash3/images/miniheroes/$ID.png',
  /* abilities */
  npc_img_ability: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/flash3/images/spellicons/$ID.png',
  /* attributes: agi int str || roles: baby cary dire disa escape gank init jung push radiant roam tank */
  npc_img_pip: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/flash3/images/heroes/selection/pip_$ID.png',
  /* items */
  npc_img_items: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/flash3/images/items/$ID.png',
}

const lang = 'english'
export const data_url = {
  /* dotabuff API - game files */
  npc_activeHeroes: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/scripts/npc/activelist.json',

  npc_heroes: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/scripts/npc/npc_heroes.json',

  npc_abilities: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/scripts/npc/npc_abilities.json',
  // npc_popular_items: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/scripts/npc/npc_popular_items.txt',
  npc_items: 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/scripts/npc/items.json',

  localization_abilities: `https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/localization/abilities_english.json`,
  localization_dota: `https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/localization/dota_english.json`, // only provides npc_dota_hero_antimage_hype
  localization_hero_lore: `https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/localization/hero_lore_english.txt`,
  localization_patch_notes: `https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/localization/patchnotes/patchnotes_english.txt`,

  // hero_chatwheel: `https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/localization/hero_chat_wheel_${lang}.txt`,
  
  npc_itembuild: herotag => `https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/itembuilds/default_${herotag}.txt`,

  /* dota2.com API - items */
  dota2com_items: 'http://www.dota2.com/jsfeed/heropediadata?feeds=itemdata&l=english',
}


export const guides = {
  base: 'https://steamcommunity.com/sharedfiles/filedetails/?id=',
  baseEmbed: 'https://www.dota2.com/workshop/builds/view?embedded=workshop&publishedfileid=129381491',
  torte: '898788847 898622068 895968997 817387228 817380197 750410650 750406868 688715106 576978688 576975639 434659379 391458050 381725812 359580647 356791078 344512092 344511398 334021836 330545830 319111870 319109248 319106719 319101948 319092835 319092788 319085962 309919893 301735208 301732264 286904891 286895078 286891439 269700420 261777247 254615876 251982939 251941747 251934276 232946791 232415624 232367327 232338429 222265746 222264754 222262678 203428546 203428541 195052251 195048794 176984007 165334812 161358226 159698040 143243384 143016376 140111731 134962374 129403206 129402805 129402256 129400942 129400559 129400259 129399862 129399377 129381491 129334727 129332786 129332354 129331714 129323738 129204328 129193377 129191918 129157199 129149991 129143802 129137630 129134687 129130896 129119115 129111538 129109889 129107725 129105276 129102427 129100110 129098268 129096483 129093311 129085778 129083818 129081331 129081035 129079469 129076227 129072324 129069615 129067853 129065509 129064094 129063701 129062086 129060054 129056935 128972272 128960249 128956358 128945163 128937771 128932114 128929132 128927319 128925332 128922664 128920907 128918471 128917369 128914193 128912519 128909765 128906539 128903691 128899869 128898296 128895761 128891336 128887479 128882317 128876778 128873254 128871463 128866569 128862386 128858659 128855291 128851981 128757681 128756420 128754907 128753951 128752632 128751287 128748151 128746588 128745244 128743885 128742802 128741319 128735861 128734250 128732275 128730475 128728638 128726494'.split(" "),
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
  
  info: '#9b99d2',
}
export const addColor = (text, color='#bdc3c7') => `<font color="${color}">${text}</font>`


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
  NPC_ITEM_PREFIX: 'DOTA_Tooltip_Ability_item_',
  DOTA_ITEM_DISASSEMBLE_ALWAYS: "Yes",
  DOTA_ITEM_DISASSEMBLE_NEVER: "No",
}