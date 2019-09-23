import * as plist from "plist";
import * as path from "path";
import * as fs from "fs";
var xcode = require('xcode');
import { upload } from 'bugsnag-sourcemaps';
import { apiKey } from "..";
import * as shell from "shelljs";

export interface iOSVersionInfo {
    build: string
    app_version: string
}

export function versionInfo(): Promise<iOSVersionInfo> {
    return new Promise((resolve, reject) => {
        let currentDir = process.cwd();
        let files = fs.readdirSync(path.join(currentDir, 'ios'))
        let xcodeprojFile: string | undefined;
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
                let infoPlistData = fs.readFileSync(path.join(currentDir, 'ios', targets[Object.keys(targets)[0]].buildSettings['INFOPLIST_FILE']), 'utf8');
                let plistData = plist.parse(infoPlistData);
                let appVersion = plistData['CFBundleShortVersionString']
                let bundle = plistData['CURRENT_PROJECT_VERSION'] || plistData['CFBundleVersion']
                if (typeof appVersion === 'string' && typeof bundle === 'string' && !isNaN(parseInt(bundle))) {
                    resolve({
                        build: bundle,
                        app_version: appVersion
                    })
                } else {
                    reject(new Error('Info.plist file could not be found'));
                }
            } catch (error) {
                reject(error);
            }
        } else {
            reject(new Error('No Xcodeproject file found'));
        }
    })
}

export function generateSourcemap(): Promise<{ minifiedPath: string, sourceMapPath: string }> {
    return new Promise((resolve, reject) => {
        let result = shell.exec('react-native bundle \
        --platform ios \
        --dev false \
        --entry-file index.js \
        --bundle-output ios-release.bundle \
        --sourcemap-output ios-release.bundle.map')
        console.log(result);
        resolve({
            minifiedPath: path.join(process.cwd(), 'ios-release.bundle'),
            sourceMapPath: path.join(process.cwd(), 'ios-release.bundle.map')
        });
    })
}

export function uploadSourcemap(sourceMap: string, minifiedFile: string, version: iOSVersionInfo): Promise<any> {
    return new Promise((resolve, reject) => {
        upload({
            apiKey: apiKey,
            appVersion: `${version.app_version} (${version.build})`,
            sourceMap: sourceMap,
            minifiedUrl: 'main.jsbundle',
            minifiedFile: minifiedFile,
            overwrite: true
        }, function (err) {
            if (err) {
                return reject(err)
            }
            resolve()
        });
    })
}