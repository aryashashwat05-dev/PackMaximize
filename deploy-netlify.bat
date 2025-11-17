@echo off
echo Building project for Netlify deployment...
npm run build

echo Installing Netlify CLI...
npm install -g netlify-cli

echo Deploying to Netlify...
netlify deploy --prod --dir=dist

echo Done!
pause
