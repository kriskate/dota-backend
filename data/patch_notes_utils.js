import { timestamp } from "../utils/utils"
import { colors, addColor } from "./constants"
import { setCurrentDotaVersionDate, setCurrentDotaVersion } from '../api/wiki-versioning'

const DOTA_HERO = 'npc_dota_hero_'
export const generatePatchNotes = ({ localization_patch_notes, odota_gameversion, npc_activeHeroes, npc_abilities, npc_items }) => {
  localization_patch_notes = localization_patch_notes.patch
  npc_activeHeroes = npc_activeHeroes.whitelist
  npc_abilities = npc_abilities.DOTAAbilities
  npc_items = npc_items.DOTAAbilities

  let patch_notes = {}

  Object.keys(localization_patch_notes).forEach((patch, idx, arr) => {
    const _patchContent = patch.split('DOTA_Patch_')[1]
    const version = _patchContent.split('_')[0] + '.' + _patchContent.split('_')[1]
    if(idx == arr.length-1) setCurrentDotaVersion(version)
    // to-do (maybe): bottom of page
    // removing these versions as they have inconsistencies
    if(['7.06d', '7.06e', '7.07'].includes(version)) return
    
    let version_date = odota_gameversion.find(p => version == p['name'])
    version_date = version_date ? version_date['date'] : timestamp()
    if(idx == arr.length-1) setCurrentDotaVersionDate(version_date)
    
    // add version change; include version_date
    if(!patch_notes[version]) patch_notes[version] = new _modelPatch(version_date)
    const patch_key = patch_notes[version]

    
    // remove version
    const cname = _patchContent.split('_').splice(2).join('_')
    const change = localization_patch_notes[patch]
    

    let hero_name = which(npc_activeHeroes, cname, 'hero')

    //console.log(hero)
    if(hero_name) {
      hero_name = hero_name.replace(DOTA_HERO, '')
      if(cname.includes('talent') || cname.includes('Talent')) {
        // -talent
        pushHero(patch_key.heroes, hero_name, 'talents', change)
      } else if(hero_name == cname || nrx(hero_name).test(cname)) {
        // -hero - the key (cname) is a general hero description if it has the same length as the hero
        // or it has a trailing "_#" - where # is a number
        pushHero(patch_key.heroes, hero_name, 'stats', change)
      } else {
        // ability - the key is an ability. it might contain trailing "_#"s
        let ability_name = cname.replace(hero_name, '').substring(1)
        if(nrx('').test(ability_name)) {
          ability_name = pop(ability_name)
        }
        
        // right now, both abilities and items look the same: "name": ["description1", "description2"]
        let hero = patch_key.heroes.find(k => k.name == hero_name)
        if(hero)
          pushItem(hero.abilities, ability_name, change)
        else 
          pushHero(patch_key.heroes, hero_name, 'abilities', new _modelItem(ability_name, change) )
      }
    } else {
      let item_name = which(npc_items, cname, 'item')

      if(item_name && (item_name == cname || nrx(item_name).test(cname)) ) {
        // -item
        if(nrx('').test(item_name)) {
          item_name = pop(item_name)
        }
        
        pushItem(patch_key.items, item_name, change)
      } else {
        // -other
        
        // ['General']
        // ['General_8_info']
        const _change = cname.includes('info') ? change : addColor(change, colors.info)
        patch_key.general.push(new _modelG(cname, _change))
      }
    }
  })

  return patch_notes
}

// for things that might have trailing "_#"s
const nrx = (name) => new RegExp(`${name}_[0-9]+`)

const _modelPatch = (version_date) => ({ version_date, heroes: [], items: [], general: [], })
const _modelHero = (name) => ({ name, stats: [], abilities: [], talents: [] })
const _modelItem = (name, description) => ({ name, description: description ? [description] : [] })
const _modelG = (name, description ) => ({ name, description })

const pop = (str) => {
  let a = str.split('_')
  a.pop()
  return a.join('_')
}

const pushItem = (arr, name, change) => {
  let item = arr.find(_item => _item.name == name)

  if(!item) {
    item = new _modelItem(name)
    arr.push(item)
  }

  item.description.push(change)
}
const pushHero = (arr, name, hero_prop, change) => {
  let hero = arr.find(_hero => _hero.name == name)

  if(!hero) {
    hero = new _modelHero(name)
    arr.push(hero)
  }

  hero[hero_prop].push(change)
}

const which = (arr_lookup, name, type) =>
  getLongest(
    Object.keys(arr_lookup).filter(clookup => {
      if(type == 'hero') clookup = clookup.replace(DOTA_HERO, '')
      return name.includes(clookup)
    })
  )

// if there are two items or heroes that with the same name
const getLongest = (arr) => 
  arr.reduce((a, b) => a.length > b.length ? a : b, '')



/* unhandled before 7.07b (7.06e, 7.07)

['Item_Courier', 'Item_Shop', 'Item_Support', 'Item_misc']
// Item_Misc_Title, Item_Misc, Item_Misc_1
['Hero']
['Generic_Regeneration_Formula', 'Generic_Regeneration_Formula_Summary_Title']

*/