const execSync = require('child_process').execSync
const run = (what) => execSync(what, {stdio:[0,1,2]})


if(execSync('git status -s').length) throw new Error('Make sure to commit everything before releasing')


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

run('echo "\n---- STEP 1 - BUILD\n"')
run('node build')

run('echo "\n---- STEP 2 - PUSH\n"')
run(`gcloud docker -- push gcr.io/pocket-dota/dota-data-background-runner:${version}`)

/* roll out a new version */
run('echo "\n---- STEP 3 - DEPLOY\n"')
run(`kubectl set image deployment/dota-data-container dota-data-container=gcr.io/pocket-dota/dota-data-background-runner:${version}`)