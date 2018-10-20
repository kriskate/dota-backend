import { fs, logger, timestamp } from '../utils/utils'
import model_info from '../data/models/model_info';


export const VERSIONF_BASE = 'versioned_data';

const _new = model_info({
  appVersion:  require('../package.json').version
});
export const getNew = () => _new;
export const setNew = (newVersion) => {
  Object.keys(newVersion).forEach(key => _new[key] = newVersion[key] || _current[key]);
}

const _current = model_info({});
export const current = () => _current;
export const setCurrent = (newVersion) => {
  Object.keys(newVersion).forEach(key => _current[key] = newVersion[key] || _current[key]);

  logger.info(`incremented WIKI version to: ${_current.wikiVersion}`);
};

export const getVersionFolder = (date, version) => (
  `${VERSIONF_BASE}/${date || _current.wikiVersionDate}_${version || _current.wikiVersion}`
)

export const getCurrentWikiInfo = () => JSON.parse(
  fs.readFileSync(`${VERSIONF_BASE}/info.json`, 'utf8')
);


/* only called once, when the service starts
 * checks for folder names
 * might change if the server will git push version folders
 */
export const initializeVersionSystem = async () => {
  setCurrent(getCurrentWikiInfo({}));

  logger.debug(`current WIKI version is: ${_current.wikiVersion}`);
}