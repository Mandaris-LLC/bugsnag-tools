Usage: rn-bugsnag-sourcemap-tools [options] [command]

A tool to upload source maps for react native appliactions on iOS and Android

This tool automatically reads out app/build version numbers from xcode / gradle projects

Options:
  -V, --version                    output the version number
  -h, --help                       output usage information

Commands:
  auto|a <apiKey> <releaseStage>   Automatically generates and uploads all sourcemaps and a new release for both platforms
  ios <apiKey> <releaseStage>      Automatically generates and uploads all sourcemaps and a new release for iOS
  android <apiKey> <releaseStage>  Automatically generates and uploads all sourcemaps and a new release for android
  help [cmd]                       display help for [cmd]