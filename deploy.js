const bump = require('npm-bump')
const run = (what) => require('child_process').execSync(what, {stdio:[0,1,2]})

/* VERSION BUMP */
// major, minor or patch
//bump(process.env.RELEASE_TYPE || 'minor')
const version = require('./package.json').version

/* Gcloud deployment */
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

run('echo "\n---- STEP 2 - PUSH\n')
run(`gcloud docker -- push gcr.io/pocket-dota/dota-data-background-runner:${version}`)

/* roll out a new version */
run('echo "\n---- STEP 3 - DEPLOY\n"')
run(`kubectl set image deployment/dota-data-container dota-data-container=gcr.io/pocket-dota/dota-data-background-runner:${version}`)


//"docker-push": "gcloud docker -- push gcr.io/pocket-dota/dota-data-background-runner",
//"docker-deploy": "kubectl run dota-data-container --image=gcr.io/pocket-dota/dota-data-background-runner --port 8080",