export const model_item_bonuses = (bonuses) => {
  const {
    bonus_damage, bonus_armor, bonus_magical_armor, bonus_spell_resist,
    bonus_movement_speed, bonus_attack_speed,
    bonus_health, bonus_health_regen,
    bonus_mana, bonus_mana_regen_pct, bonus_mana_regen,
    bonus_strength, bonus_agility, bonus_intellect, bonus_all_stats, bonus_stats,
  } = bonuses;
  return {
    bonus_damage, bonus_armor, bonus_magical_armor, bonus_spell_resist,
    bonus_movement_speed, bonus_attack_speed,
    bonus_health, bonus_health_regen,
    bonus_mana, bonus_mana_regen_pct, bonus_mana_regen,
    bonus_strength, bonus_agility, bonus_intellect, bonus_all_stats, bonus_stats,
  }
}
export const model_item_npc = (item) => {
  const {
    UpgradeRecipe, ItemDisassembleRule,
    SideShop, SecretShop, GlobalShop,
  } = item;
  return {
    UpgradeRecipe, ItemDisassembleRule,
    SideShop, SecretShop, GlobalShop,
  }
}
export default (item) => {
  const { 
    tag,
    name, description, notes, lore,
    cost, manacost, cooldown, attrib,
    category, components, recipeCost,
    npc,
    bonuses,
  } = item;
  return {
    tag,
    name, description, notes, lore,
    cost, manacost, cooldown, attrib,
    category, components, recipeCost,
    npc,
    bonuses,
  }
}