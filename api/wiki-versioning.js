import { logger, timestamp } from '../utils/utils'
import { getCurrentInfo } from './DB';
import { model_current } from '../data/models/model_wiki';


export const VERSIONF_BASE_RAW = 'raw'


export const current = model_current({});
export const set_current = (key, value) => current[key] = value;


export const incrementWikiVersion = (versionDate) => { 
  current.wikiVersion++;
  current.wikiVersionDate = timestamp();

  logger.info(`incremented WIKI version to: ${current.currentWikiVersion}`)
 }


/* only called once, when the service starts */
export const initializeVersionSystem = async () => {
  const currentInfo = await getCurrentInfo();

  Object.keys(currentInfo).forEach(key => {
    set_current(key, currentInfo[key]);
  });

  logger.debug(`current WIKI version is: ${current.wikiVersion}`);
}