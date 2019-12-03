"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
var xcode = require('xcode');
const bugsnag_sourcemaps_1 = require("bugsnag-sourcemaps");
const __1 = require("..");
const shell = require("shelljs");
function versionInfo() {
    return new Promise((resolve, reject) => {
        let currentDir = process.cwd();
        let files = fs.readdirSync(path.join(currentDir, 'ios'));
        let xcodeprojFile;
        for (let file of files) {
            if (file.endsWith('xcodeproj')) {
                xcodeprojFile = file;
                break;
            }
        }
        if (xcodeprojFile) {
            try {
                let proj = xcode.project(path.join(currentDir, 'ios', xcodeprojFile, 'project.pbxproj')).parseSync();
                let targets = proj.pbxXCBuildConfigurationSection(proj.getFirstTarget());
                const config = proj.pbxXCBuildConfigurationSection();
                const releaseScheme = Object.keys(config).find(key => config[key].name === 'Release');
                let infoPlistData = fs.readFileSync(path.join(currentDir, 'ios', targets[Object.keys(targets)[0]].buildSettings['INFOPLIST_FILE']), 'utf8');
                let appVersion = config[releaseScheme].buildSettings['MARKETING_VERSION'];
                let bundle = config[releaseScheme].buildSettings['CURRENT_PROJECT_VERSION'];
                if (typeof appVersion === 'string' && typeof bundle === 'number') {
                    resolve({
                        build: bundle.toString(),
                        app_version: appVersion
                    });
                }
                else {
                    reject(new Error('Info.plist file could not be found'));
                }
            }
            catch (error) {
                reject(error);
            }
        }
        else {
            reject(new Error('No Xcodeproject file found'));
        }
    });
}
exports.versionInfo = versionInfo;
function generateSourcemap() {
    return new Promise((resolve, reject) => {
        let result = shell.exec('react-native bundle \
        --platform ios \
        --dev false \
        --entry-file index.js \
        --bundle-output ios-release.bundle \
        --sourcemap-output ios-release.bundle.map');
        console.log(result);
        resolve({
            minifiedPath: path.join(process.cwd(), 'ios-release.bundle'),
            sourceMapPath: path.join(process.cwd(), 'ios-release.bundle.map')
        });
    });
}
exports.generateSourcemap = generateSourcemap;
function uploadSourcemap(sourceMap, minifiedFile, version) {
    return new Promise((resolve, reject) => {
        bugsnag_sourcemaps_1.upload({
            apiKey: __1.apiKey,
            appVersion: `${version.app_version} (${version.build})`,
            sourceMap: sourceMap,
            minifiedUrl: 'main.jsbundle',
            minifiedFile: minifiedFile,
            overwrite: true
        }, function (err) {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
exports.uploadSourcemap = uploadSourcemap;
//# sourceMappingURL=ios.js.map