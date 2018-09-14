const run = (what) => require('child_process').execSync(what, {stdio:[0,1,2]})
const v = require('./package.json').version

run('node node_modules/dockerignore/cli.js --unignore \"secrets/,.dockerignore,.gitignore\" --ignore \".git,api-test/,release.js\"')
run(`echo "\n -- current app version ${v} -- \n"`)
run(`docker build -t gcr.io/pocket-dota/dota-data-background-runner:${v} .`)