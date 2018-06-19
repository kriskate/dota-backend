import model_item from '../data/model_item'
import { images, ItemConstants } from '../data/constants'

export const generateItems = ({ items_raw, npc_items }) => {
  items_raw = items_raw.itemdata
  npc_items = npc_items.DOTAAbilities

  const items = []

  Object.keys(items_raw).forEach(tag => {
    items.push(new model_item({
      tag, ...items_raw[tag],
      img: images.base_items.replace('$ID', tag),

      ItemDisassembleRule: ItemConstants[ npc_items[`${ItemConstants.DOTA_PREFIX}${tag}`].ItemDisassembleRule || "DOTA_ITEM_DISASSEMBLE_NEVER" ],
      AbilityCastRange: npc_items[`${ItemConstants.DOTA_PREFIX}${tag}`].AbilityCastRange || '',
    }))
  })

  return items
}