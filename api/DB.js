// will use the same token file for both front and back ends
import { user, email, pass, repo, reponame } from '../secrets/dota-bot-git-credentials.json'
import { prod } from '../utils/runtime-vars'
import { logger, fs, rimraf } from '../utils/utils'
import { VERSIONF_BASE, current } from './wiki-versioning'

import gitP from 'simple-git/promise'


const remote = `https://${repo}`
const pushRemote = `https://${user}:${pass}@${repo}`

// set only once, in initDB
let git
let tried_pull = false

export const initDB = async () => {
  await gitPullClone()
}


export const updateDB = async () => {
  if(prod) await pushToGit()
}


const gitPullClone = async () => {
  if(!fs.existsSync(VERSIONF_BASE)) {
    // if git data doesn't exist, clone the remote
    try{
      logger.info(`cloning remote ${remote} into ${VERSIONF_BASE}`)

      await gitP().silent(true).clone(pushRemote, VERSIONF_BASE)
      git = await gitP(VERSIONF_BASE)
      await git.addConfig('user.name', user)
      await git.addConfig('user.email', email)
    } catch(e) {
      console.error(`failed cloning git remote ${remote}:`, e)
    }
  } else {
    // check if git data already exists, don't clone the whole repo again
    logger.info(`${VERSIONF_BASE} folder exists... pulling git data`)

    try {
      git = await gitP(VERSIONF_BASE)
      logger.debug(`git reset`, remote)
      await git.clean("f", ["-fd"])
      await git.reset('hard')
      await git.pull()
    } catch (e) {
      logger.error('could not pull git data', e)

      if(!tried_pull) {
        tried_pull = true

        logger.warn(`removing ${VERSIONF_BASE} folder and reinitializing git`)
        await rimraf(VERSIONF_BASE)
        await gitPullClone()
      }
    }
  }
}


const gitStatus = async () => {
  let status = null
  try { 
    status = await git.status()
  } catch (e) {
    logger.error('git status failed, cannot push to git', e)
  }
  return status
}


const pushToGit = async () => {
  logger.info('... pushing to git')

  try {
    await git.add('./*')
    await git.commit(`New data: v${current().wikiVersion} for dota patch v${current().dotaVersion}`)
    await git.push('origin', 'master')

    logger.log('silly', 'git push succeeded')
  } catch(e) {
    logger.error('git push failed', e)
  }
}