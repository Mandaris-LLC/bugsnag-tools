"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const bugsnag_sourcemaps_1 = require("bugsnag-sourcemaps");
const __1 = require("..");
const shell = require("shelljs");
function versionInfo() {
    return new Promise((resolve, reject) => {
        let currentDir = process.cwd();
        let files = fs.readdirSync(path.join(currentDir, 'android', 'app'));
        let gradleFile;
        for (let file of files) {
            if (file === 'build.gradle') {
                gradleFile = file;
                break;
            }
        }
        if (gradleFile) {
            try {
                var g2js = require('gradle-to-js/lib/parser');
                return g2js.parseFile(path.join(currentDir, 'android', 'app', gradleFile)).then(function (plistData) {
                    let appVersion = plistData['android']['defaultConfig']['versionName'];
                    let bundle = plistData['android']['defaultConfig']['versionCode'];
                    if (typeof appVersion === 'string' && typeof bundle === 'string') {
                        resolve({
                            version_code: bundle,
                            app_version: appVersion
                        });
                    }
                    else {
                        reject(new Error('Info.plist file could not be found'));
                    }
                });
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
        --platform android \
        --dev false \
        --entry-file index.js \
        --bundle-output android-release.bundle \
        --sourcemap-output android-release.bundle.map');
        console.log(result);
        resolve({
            minifiedPath: path.join(process.cwd(), 'android-release.bundle'),
            sourceMapPath: path.join(process.cwd(), 'android-release.bundle.map')
        });
    });
}
exports.generateSourcemap = generateSourcemap;
function uploadSourcemap(sourceMap, minifiedFile, version) {
    return new Promise((resolve, reject) => {
        bugsnag_sourcemaps_1.upload({
            apiKey: __1.apiKey,
            appVersion: `${version.app_version} (${version.version_code})`,
            sourceMap: sourceMap,
            minifiedUrl: 'index.android.bundle',
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
//# sourceMappingURL=android.js.map