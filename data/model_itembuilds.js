export default data => {  
  const itemBuilds = {
    DOTA_Item_Build_Starting_Items: [],
    DOTA_Item_Build_Starting_Items_Secondary: [],
    DOTA_Item_Build_Early_Game: [],
    DOTA_Item_Build_Early_Game_Secondary: [],
    DOTA_Item_Build_Core_Items: [],
    DOTA_Item_Build_Core_Items_Secondary: [],
    DOTA_Item_Build_Mid_Items: [],
    DOTA_Item_Build_Late_Items: [],
    DOTA_Item_Build_Other_Items: [],
  }
  const r_items = /item_.+?"/g;
  Object.keys(itemBuilds).forEach(moment => {
    try{
      const r_moment = new RegExp(moment +'(.|\n)+?}', 'g');
      const moment_items = data.match(r_moment)[0];
      const items = moment_items.match(r_items);
      items.forEach((item, idx) => items[idx] = item.replace(/"/g, ''));
      itemBuilds[moment] = items;
    } catch(e) {
      // current hero doesn't have current moment build
    }
  })

  return itemBuilds;
}