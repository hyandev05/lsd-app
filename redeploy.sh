#!/bin/bash
cd /home/hyanhasta05/workspace/playground/lsd-app

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 22

npx vite build

git add -f dist/
git add -A
git rm --cached redeploy.sh deploy.sh 2>/dev/null

git commit -m "chore: rebuild dist, remove unused workflow"
git push origin main

echo "=== DONE ==="
