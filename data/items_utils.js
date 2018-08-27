import model_item, { model_item_bonuses, model_item_npc } from '../data/model_item'
import { ItemConstants } from '../data/constants'


const itemCategories = {
  Consumables: [
    'tpscroll', 'clarity', 'faerie_fire', 'smoke_of_deceit', 'ward_observer', 'ward_sentry',
    'enchanted_mango', 'flask', 'tango', 'tome_of_knowledge', 'dust', 'courier', 'bottle',
  ],
  Attributes: [
    'branches', 'gauntlets', 'slippers', 'mantle', 'circlet', 'belt_of_strength', 'boots_of_elves',
    'robe', 'ogre_axe', 'blade_of_alacrity', 'staff_of_wizardry',
  ],
  Armaments: [
    'ring_of_protection', 'stout_shield', 'quelling_blade', 'infused_raindrop', 'orb_of_venom',
    'blight_stone', 'blades_of_attack', 'chainmail', 'quarterstaff', 'helm_of_iron_will',
    'javelin', 'broadsword', 'claymore', 'mithril_hammer',
  ],
  Arcane: [
    'magic_stick', 'wind_lace', 'ring_of_regen', 'sobi_mask', 'boots', 'gloves', 'cloak',
    'ring_of_health', 'void_stone', 'gem', 'lifesteal', 'shadow_amulet', 'ghost', 'blink',
  ],
  Common: [
    'magic_wand', 'null_talisman', 'wraith_band', 'bracer', 'soul_ring', 'phase_boots', 'power_treads',
    'oblivion_staff', 'pers', 'hand_of_midas', 'travel_boots', 'moon_shard',
  ],
  Support: [
    'ring_of_basilius', 'headdress', 'buckler', 'urn_of_shadows', 'tranquil_boots', 'ring_of_aquila',
    'medallion_of_courage', 'arcane_boots', 'ancient_janggo', 'vladmir', 'mekansm',
    'spirit_vessel', 'pipe', 'guardian_greaves',
  ],
  Caster: [
    'glimmer_cape', 'veil_of_discord', 'aether_lens', 'force_staff', 'necronomicon', 'solar_crest',
    'dagon', 'cyclone', 'rod_of_atos', 'orchid', 'ultimate_scepter', 'nullifier',
    'refresher', 'sheepstick', 'octarine_core',
  ],
  Weapons: [
    'lesser_crit', 'armlet', 'meteor_hammer', 'invis_sword', 'basher', 'bfury',
    'monkey_king_bar', 'ethereal_blade', 'radiance', 'greater_crit', 'butterfly', 'silver_edge',
    'rapier', 'abyssal_blade', 'bloodthorn'
  ],
  Armor: [
    'hood_of_defiance', 'vanguard', 'blade_mail', 'soul_booster', 'crimson_guard', 'aeon_disk',
    'black_king_bar', 'lotus_orb', 'shivas_guard', 'hurricane_pike', 'sphere', 'bloodstone',
    'manta', 'heart', 'assault',
  ],
  Artifacts: [
    'dragon_lance', 'sange', 'yasha', 'kaya', 'mask_of_madness', 'helm_of_the_dominator', 'echo_sabre',
    'maelstrom', 'diffusal_blade', 'heavens_halberd', 'desolator', 'sange_and_yasha', 'skadi',
    'satanic', 'mjollnir',
  ],
  "Secret shop": [
    'energy_booster', 'vitality_booster', 'point_booster', 'platemail', 'talisman_of_evasion' , 'hyperstone',
    'ultimate_orb', 'demon_edge', 'mystic_staff', 'reaver', 'eagle', 'relic',
  ],
}


const getBonuses = (special) => {
  const bonuses = {}
  
  if(!special) return {}
  else special.forEach(bonus => {
    const key = Object.keys(bonus)[0]
    bonuses[key] = bonus[key]
  })
  
  return bonuses
}
export const generateItems = ({ dota2com_items, npc_items }) => {
  dota2com_items = dota2com_items.itemdata
  npc_items = npc_items.DOTAAbilities

  const items = []

  Object.keys(itemCategories).forEach(category =>
    itemCategories[category].forEach(tag => {
      const npc_tag = `${ItemConstants.DOTA_PREFIX}${tag}`
      const npc_item = npc_items[npc_tag]
      const dota2com_item = dota2com_items[tag]
      
      const { attrib, dname, desc, notes, lore, } = dota2com_item
      const { ItemCost, AbilityManaCost, AbilityCooldown, ItemRequirements, } = npc_item
      
      const recipe = npc_items['item_recipe_' + tag]
      let recipeCost, components
      if(recipe) {
        recipeCost = recipe.ItemCost == "0" ? '' : recipe.ItemCost
        components = recipe.ItemRequirements
      } else components = ItemRequirements
      if(components) components = components[0].split(';')

      const bonuses = new model_item_bonuses(getBonuses(npc_item.AbilitySpecial))
      const npc = new model_item_npc(npc_item)
      const newItem = new model_item({
        tag,
        name: dname, description: desc, notes, lore,
        cost: ItemCost, manacost: AbilityManaCost, cooldown: AbilityCooldown, attrib,
        category, components, recipeCost,
        npc,
        bonuses,
      })

      items.push(newItem)
    })
  )

  return items
}