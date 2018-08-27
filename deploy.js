/* make sure that:
* you have git installed an you're authenticated
* docker is running
* secrets/dota-bot-git-credentials.json exists
*/


const execSync = require('child_process').execSync
const run = (what, cd) => execSync(what, {cwd: cd ? cd : null, stdio:[0,1,2]})

let cstep = 0

const STEP = (msg) => {
  cstep++
  run(`echo -e "\\033[1;35m\n---- STEP ${cstep} - ${msg}\n\\033[0m"`)
}


if(execSync('git status -s').length) throw new Error('Make sure to commit everything before releasing')



STEP('VERSION BUMP')
/* VERSION BUMP */
// major, minor or patch
const fs = require('fs')
const semver = require('semver')

const PJcontent = require('./package.json')
const version = semver.inc(PJcontent.version, process.env.RELEASE_TYPE || 'patch')
PJcontent.version = version

fs.writeFileSync('package.json', `${ JSON.stringify(PJcontent, null, 2) }\n`);

run('git add .')
run(`git commit -m "Released version ${version}"`)
run(`git tag ${version}`)




/* in order to generate a new wiki when rolling an update, we have to remove the last wiki version */
STEP('REMOVE LAST WIKI')

const repo = 'https://github.com/kriskate/dota-data.git'
const VERSIONF_BASE = 'versioned_data'
try {
  run(`git clone ${repo} ${VERSIONF_BASE}`)
} catch(e) {
  console.warn('!!!!  PLEASE REMOVE version_folder, as git reset --hard doesn\'t work properly if operation failed before')
}
run(`git reset --hard`, VERSIONF_BASE)
run(`git pull`, VERSIONF_BASE)

const info = require('./versioned_data/info.json')
const wiki_v = info.currentWikiVersion
const wiki_vDate = info.currentWikiVersionDate
const lastWikiFolder = `v_${wiki_v}_${wiki_vDate}`

try {
  run(`rm -rf ${VERSIONF_BASE}/${lastWikiFolder}`)
  run('git add .', VERSIONF_BASE)
  run(`git commit -m "Removed wiki v_${wiki_v} for new app version: ${version}"`, VERSIONF_BASE)
  console.log(`pushing removed v_${wiki_v}`)
  run('git push --all', VERSIONF_BASE)
} catch(e) {
  // fails if nothing to commit; for instance, if we ran deploy but a step below this one failed
}




/* Gcloud DEPLOYMENT */
/* prerequisites:
1. create cluster through GC UI
2. set `gcloud credentials` for kubernetes accordingly (https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app)
- gcloud config set compute/zone $clusterZone
- gcloud container clusters get-credentials $clusterName

3. initial deploy
run(`kubectl run dota-data-container --image=gcr.io/pocket-dota/dota-data-background-runner:${version} --port 8080`)
run('kubectl expose deployment dota-data-container --type=LoadBalancer --port 80 --target-port 8080')
*/

STEP('BUILD')
run('node build')

STEP('PUSH')
run(`gcloud docker -- push gcr.io/pocket-dota/dota-data-background-runner:${version}`)

/* roll out a new version */
STEP('DEPLOY')
run(`kubectl set image deployment/dota-container dota-container=gcr.io/pocket-dota/dota-data-background-runner:${version}`)