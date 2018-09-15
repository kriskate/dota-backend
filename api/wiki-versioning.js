import { logger } from '../utils/utils'
import { getCurrentInfo, getCurrentWiki } from './DB';
import model_wiki, { model_current } from '../data/models/model_wiki';


let localWiki = model_wiki({});
export const getLocalWiki = () => localWiki;


/* only called once, when the service starts */
export const initializeVersionSystem = async (newWiki) => {
  if(newWiki) localWiki = newWiki;
  else localWiki = await getCurrentWiki();

  logger.debug(`current WIKI version is: ${localWiki.current.wikiVersion}`);
}