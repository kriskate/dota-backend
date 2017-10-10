import model_dota, {ability, stats, hero} from './model_dota'
import model_user from './model_user'

export default JSON.stringify({

  users: [ new model_user() ],

  dotaData: new model_dota(),

})