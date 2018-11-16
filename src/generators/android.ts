import * as path from "path";
import * as fs from "fs";

export interface AndroidVersionInfo {
    app_version: string;
    version_code: string;
}

export function versionInfo(): Promise<AndroidVersionInfo> {
    return new Promise((resolve, reject) => {
        let currentDir = process.cwd();
        let files = fs.readdirSync(path.join(currentDir, 'android', 'app'))
        let gradleFile: string | undefined;
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
                    let appVersion = plistData['android']['defaultConfig']['versionName']
                    let bundle = plistData['android']['defaultConfig']['versionCode']
                    if (typeof appVersion === 'string' && typeof bundle === 'string') {
                        resolve({
                            version_code: bundle,
                            app_version: appVersion
                        })
                    } else {
                        reject(new Error('Info.plist file could not be found'));
                    }
                });

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