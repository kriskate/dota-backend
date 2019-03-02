import { fs, logger, timestamp } from '../utils/utils'
import model_info from '../data/models/model_info';


export const VERSIONF_BASE = 'versioned_data';
export const VERSIONF_DATA = 'data';

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

export const getTempFolder = (language) => (
  `${VERSIONF_BASE}/temp/${language}`
)
export const getVersionFolder = (language) => (
  `${VERSIONF_BASE}/${VERSIONF_DATA}/${language}`
)

export const getCurrentWikiInfo = () => JSON.parse(
  fs.readFileSync(`${VERSIONF_BASE}/${VERSIONF_DATA}/info.json`, 'utf8')
);


/* only called once, when the service starts
 * checks for folder names
 * might change if the server will git push version folders
 */
export const initializeVersionSystem = async () => {
  setCurrent(getCurrentWikiInfo());

  logger.debug(`current WIKI version is: ${_current.wikiVersion}`);
}



export const setVersions = () => {
  let needsUpdate = false;

  const newWikiVersion = current().wikiVersion + 1;
  const newWikiVersionDate = timestamp();
  const newAppVersion = require('../package.json').version;

  // check if app version is the same
  if(newAppVersion !== current().appVersion) {
    needsUpdate = true;
    logger.info(`the current info has been generated with an older app version (${current().appVersion})`)
  }

  setNew({
    appVersion: newAppVersion,
    // dotaVersion and date are set in patch_notes_utils
    wikiVersion: newWikiVersion,
    wikiVersionDate: newWikiVersionDate,
    // wikiVersionFolder: newDataF.replace(VERSIONF_BASE + '/', ''),
  })

  return needsUpdate;
}