const run = (what) => require('child_process').execSync(what, {stdio:[0,1,2]})

run('node build')
run(`docker run -t -i -e --rm -p 8080:8080 --name dota-data-container gcr.io/pocket-dota/dota-data-background-runner`)