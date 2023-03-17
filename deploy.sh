set -e
npm run build
cd dist
git init 
git add -A
git commit -m 'deploy'
git push -f https://github.com/sao20010301/github-clone.git master:gh-pages