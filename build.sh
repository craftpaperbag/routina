mkdir Built
electron-packager ./routina 'Routina' --out Built\
  --overwrite\
  --platform=darwin,win32\
  --arch=x64 --version=0.30.1 #\
  #--icon=./app/images/icon.icns
