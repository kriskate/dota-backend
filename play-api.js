import fetch from 'isomorphic-fetch'


const url_heroes = 'http://www.dota2.com/jsfeed/heropickerdata?v=4144804b4144804&l=english'
const url_heroes_long = 'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/scripts/npc/npc_heroes.json'

const url_abilities = 'http://www.dota2.com/jsfeed/heropediadata?feeds=abilitydata&l=english'
const url_items = 'http://www.dota2.com/jsfeed/heropediadata?feeds=itemdata&l=english'
const url_stats = 'http://www.dota2.com/jsfeed/heropediadata?feeds=herodata&l=english'

const url_base_img_abilities = 'http://cdn.dota2.com/apps/dota2/images/abilities/$ID_hp1.png'
const url_base_img_items = 'http://cdn.dota2.com/apps/dota2/images/items/$ID_lg.png'


const test = async () => {
  let heroes = await fetchJSON(url_heroes_long)
  console.log(heroes)
}
const fetchJSON = (url) => fetch(url).then(res => res.json()).then(res => res)

test()
//export default fetch(url_heroes).then(res => res.json()).then(res => console.log(res))