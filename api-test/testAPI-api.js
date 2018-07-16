// gets a new copy of the data to be parsed, strips and pushes it to api-test/raw

import { createFile, getRawData } from "../api/wiki_utils"

const tfld = 'api-test/raw', aa = 'ancient_apparition', blink = 'blink', tip = 'dota_tip_advanced_1', r_blank = 'rest_are_blank'

const rules = {
  odota_gameversion: null,
  npc_patch_notes: null,

  npc_activeHeroes: null,

  npc_heroes: { rules: [aa], f: 'DOTAHeroes' },
  npc_abilities:  { rules: [aa], f: 'DOTAAbilities' },
  npc_popular_items: { rules: [aa], f: 'DOTAHeroes' },
  npc_items: { rules: [blink, r_blank], f: 'DOTAAbilities' },
  npc_dota: { rules: [aa, blink, tip], f: ['lang', 'Tokens'] },
  
  dota2com_items: { rules: [blink], f: 'itemdata' },
}


function strip(data, name) {
  //console.log(name)

  if(rules[name]) {
    let root = name == 'npc_dota' ? root = data.lang.Tokens : data[rules[name].f]
    
      Object.keys(root).forEach(key => {
        let keyData = null

        rules[name].rules.forEach(rule =>
          keyData = key.includes(rule) ? JSON.parse(JSON.stringify(root[key])) : keyData)

        if(keyData) root[key] = keyData
        else {
          if(rules[name].rules.includes(r_blank)) root[key] = {}
          else delete root[key]
        }
      })
  }
  
  createFile(name, tfld, data)
}


async function run() {
  const data = await getRawData()
  Object.keys(data).forEach(d => strip(data[d], d))
}
run()