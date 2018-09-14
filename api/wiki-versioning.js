import { logger } from '../utils/utils'
import { getCurrentInfo } from './DB';
import { model_current } from '../data/models/model_wiki';


let current = model_current({});
export const getCurrent = () => current;


/* only called once, when the service starts */
export const initializeVersionSystem = async (newInfo) => {
  if(newInfo) current = newInfo;
  else current = await getCurrentInfo();

  logger.debug(`current WIKI version is: ${current.wikiVersion}`);
}