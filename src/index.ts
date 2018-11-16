#!/usr/bin/env node
import * as commander from 'commander'
import reportRelease from './generators/reporter';
import * as iOS from './generators/ios';
import * as Android from './generators/android';
import * as fs from 'fs';


export let apiKey: string;

commander.version('1.0').description('Mandaris Bugsnag CLI Tools')

commander
    .command('auto <apiKey> <releaseStage>')
    .alias('a')
    .description('Automatically generates and uploads all sourcemaps and a new release ')
    .action((key, releaseStage) => {
        apiKey = key;
        let iosVersion: iOS.iOSVersionInfo;
        let androidVersion: Android.AndroidVersionInfo;
        iOS.versionInfo().then(async (version) => {
            await reportRelease(version, releaseStage);
            iosVersion = version;
            console.info(`Release iOS ${version.app_version} (${version.build}) reported successfully`);
        }).then(() => {
            return Android.versionInfo()
        }).then(async (version) => {
            await reportRelease(version, releaseStage);
            androidVersion = version
            console.info(`Release Android ${version.app_version} (${version.version_code}) reported successfully`);
        }).then(async () => {
            const file = await iOS.generateSourcemap();
            console.info(`Sourcemaps iOS generated successfully (${file.sourceMapPath})`);
            return file;
        }).then(async (file) => {
            await iOS.uploadSourcemap(file.sourceMapPath, file.minifiedPath, iosVersion);
            console.info(`Sourcemaps iOS uploaded successfully`);
            try {
                fs.unlinkSync(file.minifiedPath);
                fs.unlinkSync(file.sourceMapPath);
                console.info(`Sourcemaps iOS cleanup complete`);
            }
            catch {
            }
        }).then(async () => {
            const file = await Android.generateSourcemap();
            console.info(`Sourcemaps Android generated successfully (${file.sourceMapPath})`);
            return file;
        }).then(async (file) => {
            await Android.uploadSourcemap(file.sourceMapPath, file.minifiedPath, androidVersion);
            console.info(`Sourcemaps Android uploaded successfully`);
            try {
                fs.unlinkSync(file.minifiedPath);
                fs.unlinkSync(file.sourceMapPath);
                console.info(`Sourcemaps Android cleanup complete`);
            }
            catch {
            }
        }).then(() => {
            console.info('Bugsnag CLI finished successfully');
        }).catch((error) => {
            console.error(error);
        })
    })

commander.parse(process.argv)
