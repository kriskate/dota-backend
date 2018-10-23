import { timestamp } from "../utils/utils"
import { colors, addColor } from "./constants"
import { setNew } from '../api/wiki-versioning'
import { JSDOM } from 'jsdom';

const DOTA_HERO = 'npc_dota_hero_'
export const generatePatchNotes = async ({ localization_patch_notes, odota_gameversion, npc_activeHeroes, npc_abilities, npc_items }) => {
  localization_patch_notes = localization_patch_notes.patch
  npc_activeHeroes = npc_activeHeroes.whitelist
  npc_abilities = npc_abilities.DOTAAbilities
  npc_items = npc_items.DOTAAbilities

  const gamepedia_versions = await gamepediaVersions(npc_activeHeroes, npc_items);
  let patch_notes = {}

  Object.keys(localization_patch_notes).forEach((patch, idx, arr) => {
    const _patchContent = patch.split('DOTA_Patch_')[1]

    const version = _patchContent.split('_')[0] + '.' + _patchContent.split('_')[1]
    // to-do (maybe): bottom of page
    // removing these versions as they have inconsistencies
    if(['7.06d', '7.06e', '7.07'].includes(version)) return
    
    let gamepediaCorrespondant = gamepedia_versions.find(v => v.version == version);
    let version_date = gamepediaCorrespondant.date;
    const changes_short = gamepediaCorrespondant.changes_short;

    if(idx == arr.length-1) {
      setNew({
        dotaVersion: version,
        dotaVersionDate: version_date,
      });
    }
    
    // add version change; include version_date
    if(!patch_notes[version]) patch_notes[version] = new _modelPatch(version_date, changes_short);
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

const _modelPatch = (version_date, changes_short) => ({ version_date, changes_short, heroes: [], items: [], general: [], })
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




/* gamepedia import */

export const gamepediaVersions = async (npc_activeHeroes, npc_items) => {
  let headers = new Headers({
    'Access-Control-Allow-Origin':'*',
    'Content-Type': 'multipart/form-data'
  });
  let opt = {
      mode: 'no-cors',
      header: headers,
  };
  const content = await (await fetch("https://dota2.gamepedia.com/Game_Versions", opt)).text();
  const root = new JSDOM(content)
  const table = root.window.document.querySelector('.wikitable')

  const versions = toArr(table.querySelectorAll('tr'))
    // all table rows that have 4 columns
    .filter(tr => tr.querySelectorAll('td').length === 4)
    // if lower than 7.07b, don't show
    .filter(tr => {
      const version = trim(tr.querySelectorAll('td')[0].textContent);
      return parseFloat(version) >= 7.07 && version != '7.07';
    })
    .map(v => {
      const version = trim(v.querySelectorAll('td')[0].textContent);
      const changes_short = getChanges(v.querySelectorAll('td')[1], root, npc_activeHeroes, npc_items);
      const date = trim(v.querySelectorAll('td')[2].textContent);

      if(!version || !changes_short) return undefined
      else return { version, changes_short, date, }
    })
  // console.log(versions)
  return versions
}


const getChanges = (td, root, npc_activeHeroes, npc_items) => 
  toArr(td.querySelectorAll('li'))
    .map(c => {
      toArr(c.querySelectorAll('.image-link')).forEach(span =>
        span.outerHTML = span.innerHTML
      );
      toArr(c.querySelectorAll('a')).map(a => {
        a.href = mapHref(a);
        a.href = Object.keys(npc_activeHeroes).includes(`npc_dota_hero_${a.href}`)
          ? `heroes/${a.href}`
          : Object.keys(npc_items).includes(`item_${a.href}`) ? `items/${a.href}`
          : ''

        // if has text, show text
        if(a.textContent) {
          const newA = root.window.document.createElement('b');
          newA.innerHTML = `${a.textContent}`;
          a.parentNode.replaceChild(newA, a);
        } else {
          // if no href, meaning not a hero / item, remove
          if(!a.href) {
            a.parentNode.removeChild(a);
          } else {
            const newA = root.window.document.createElement('img');
            newA.src = a.href;
            a.parentNode.replaceChild(newA, a);
          }
        }


      })
      return trim(c.innerHTML);
    })


const toArr = (arr) => Array.prototype.slice.call(arr);
const trim = (str) => str.trim().replace('\n', '');


const mapHref = (a) => {
  const href = a.href.toLowerCase().split('/')[1];
  if (href.includes('courier')) return 'courier';
  if (href == 'zeus') return 'zuus';
  if (href == 'necrophos') return 'necrolyte';
  if (href == 'treant_protector') return 'treant';
  if (href == 'vengeful_spirit') return 'vengefulspirit';
  if (href == 'wraith_king') return 'skeleton_king';
  if (href == 'io') return 'wisp';
  if (href == 'nature%27s_prophet') return 'furion';
  if (href == 'centaur_warrunner') return 'centaur';
  if (href == 'outworld_devourer') return 'obsidian_destroyer';
  if (href == 'timbersaw') return 'shredder';
  if (href == 'windranger') return 'windrunner';
  if (href == 'doom') return 'doom_bringer';
  if (href == 'anti-mage') return 'antimage';
  if (href == 'magnus') return 'magnataur';
  if (href == 'shadow_fiend') return 'nevermore';

  if (href == 'queen_of_pain') return 'queenofpain';
  if (href == 'clockwerk') return 'rattletrap';
  if (href == 'underlord') return 'abyssal_underlord';

  return href;
}