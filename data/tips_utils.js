export const generateDotaTips = ({ npc_dota }) => {
    npc_dota = npc_dota.lang.Tokens

    let tips = null

    Object.keys(npc_dota).forEach(key => {
      if(key.substring(0,9) === 'dota_tip_') {
        let cat = key.split('_')[2]
        if(['browse', 'customize', 'suggested'].includes(cat)) return

        if(!tips) tips = {}
        
        if(!tips[cat]) tips[cat] = []
        tips[cat].push(npc_dota[key])
      }
    })

    return tips
}