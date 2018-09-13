const execSync = require('child_process').execSync
const run = (what, cd) => execSync(what, {cwd: cd ? cd : null, stdio:[0,1,2]})

let cstep = 0

const STEP = (msg) => { cstep++; run(`echo -e "\\033[1;35m\n---- STEP ${cstep} - ${msg}\n\\033[0m"`);}

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


STEP('GCLOUD DEPLOY')
run('gcloud app deploy')