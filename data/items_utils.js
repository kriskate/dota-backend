import model_item from '../data/model_item'
import { images, ItemConstants } from '../data/constants'

export const generateItems = ({ dota2com_items, npc_items }) => {
  dota2com_items = dota2com_items.itemdata
  npc_items = npc_items.DOTAAbilities

  const items = []

  Object.keys(dota2com_items).forEach(tag => {
    items.push(new model_item({
      tag, ...dota2com_items[tag],
      img: images.base_items.replace('$ID', tag),

      ItemDisassembleRule: ItemConstants[ npc_items[`${ItemConstants.DOTA_PREFIX}${tag}`].ItemDisassembleRule || "DOTA_ITEM_DISASSEMBLE_NEVER" ],
      AbilityCastRange: npc_items[`${ItemConstants.DOTA_PREFIX}${tag}`].AbilityCastRange || '',
    }))
  })

  return items
}