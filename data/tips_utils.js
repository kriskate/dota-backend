const trim = (str) => str.replace(/(\\\")/g, '\"')

export const generateDotaTips = ({ localization_dota }) => {
  localization_dota = localization_dota.lang.Tokens

    let tips = {}

    Object.keys(localization_dota).forEach(key => {
      if(key.substring(0,9) === 'dota_tip_') {
        let cat = key.split('_')[2]
        if(['browse', 'customize', 'suggested', 'lore'].includes(cat)) return
        
        const content = trim(localization_dota[key]);
        if(cat == 'hero') {
          const hero = key.replace('dota_tip_hero_', '').split('_').slice(0, -1).join('_')
          
          if(!tips[cat]) tips[cat] = {}
          if(!tips[cat][hero]) tips[cat][hero] = []

          tips[cat][hero].push(content)
        } else {
          if(!tips[cat]) tips[cat] = []
          tips[cat].push(content)
        }
      }
    })

    return tips
}