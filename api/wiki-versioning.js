import { logger } from '../utils/utils'
import { getCurrentInfo } from './DB';
import { model_current } from '../data/models/model_wiki';


export const current = model_current({});


/* only called once, when the service starts */
export const initializeVersionSystem = async () => {
  current = await getCurrentInfo();

  logger.debug(`current WIKI version is: ${current.wikiVersion}`);
}