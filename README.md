Publish for windows:

```
yarn build && yarn electron:tsc:prod && yarn make --arch x64 --platform win32 --targets @electron-forge/maker-zip
```
