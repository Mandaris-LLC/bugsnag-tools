import * as path from "path";
import * as fs from "fs";
import { upload } from "bugsnag-sourcemaps"
import { apiKey } from "..";
import * as shell from "shelljs";

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
            console.log(gradleFile)
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

export function generateSourcemap(): Promise<{ minifiedPath: string, sourceMapPath: string }> {
    return new Promise((resolve, reject) => {
        let result = shell.exec('react-native bundle \
        --platform android \
        --dev false \
        --entry-file index.js \
        --bundle-output android-release.bundle \
        --sourcemap-output android-release.bundle.map')
        console.log(result);
        resolve({
            minifiedPath: path.join(process.cwd(), 'android-release.bundle'),
            sourceMapPath: path.join(process.cwd(), 'android-release.bundle.map')
        });
    })
}

export function uploadSourcemap(sourceMap: string, minifiedFile: string, version: AndroidVersionInfo): Promise<any> {
    return new Promise((resolve, reject) => {
        upload({
            apiKey: apiKey,
            appVersion: `${version.app_version} (${version.version_code})`,
            sourceMap: sourceMap,
            minifiedUrl: 'index.android.bundle',
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