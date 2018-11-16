import * as plist from "plist";
import * as path from "path";
import * as fs from "fs";
var xcode = require('xcode');

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
                let bundle = plistData['CFBundleVersion']

                if (typeof appVersion === 'string' && typeof bundle === 'string') {
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

export function generateSourcemap(): Promise<{ filePath: string }> {
    return new Promise((resolve, reject) => {

    })
}

export function uploadSourcemap(file: string): Promise<any> {
    return new Promise((resolve, reject) => {

    })
}