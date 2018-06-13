import model_item from '../data/model_item'
import { images } from '../data/constants'

export const generateItems = ({ items_raw }) => {
  items_raw = items_raw.itemdata

  const items = []

  Object.keys(items_raw).forEach(tag => {
    items.push(new model_item({
      tag, ...items_raw[tag],
      img: images.base_items.replace('$ID', tag),
    }))
  })

  return items
}