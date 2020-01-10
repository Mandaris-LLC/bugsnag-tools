#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const reporter_1 = require("./generators/reporter");
const iOS = require("./generators/ios");
const Android = require("./generators/android");
const fs = require("fs");
const path = require("path");
commander
    .version(JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'))['version'])
    .description('A tool to upload source maps for react native appliactions on iOS and Android');
commander
    .command('auto <apiKey> <releaseStage>')
    .description('Automatically generates and uploads all sourcemaps and a new release for both platforms')
    .alias('a')
    .action((key, releaseStage) => {
    exports.apiKey = key;
    iOSProcedure(releaseStage).then(() => {
        return androidProcedure(releaseStage);
    }).then(() => {
        console.info('Bugsnag CLI finished successfully');
    }).catch((error) => {
        console.error(error);
    });
});
commander
    .command('ios <apiKey> <releaseStage>')
    .description('Automatically generates and uploads all sourcemaps and a new release for iOS')
    .action((key, releaseStage) => {
    exports.apiKey = key;
    iOSProcedure(releaseStage).then(() => {
        console.info('Bugsnag CLI finished successfully');
    }).catch((error) => {
        console.error(error);
    });
});
commander
    .command('android <apiKey> <releaseStage>')
    .description('Automatically generates and uploads all sourcemaps and a new release for android')
    .action((key, releaseStage) => {
    exports.apiKey = key;
    androidProcedure(releaseStage).then(() => {
        console.info('Bugsnag CLI finished successfully');
    }).catch((error) => {
        console.error(error);
    });
});
commander.parse(process.argv);
function iOSProcedure(releaseStage) {
    return __awaiter(this, void 0, void 0, function* () {
        let iosVersion;
        return iOS.versionInfo().then((version) => __awaiter(this, void 0, void 0, function* () {
            yield reporter_1.default(version, releaseStage);
            iosVersion = version;
            console.info(`Release iOS ${version.app_version} (${version.build}) reported successfully`);
        })).then(() => __awaiter(this, void 0, void 0, function* () {
            const file = yield iOS.generateSourcemap();
            console.info(`Sourcemaps iOS generated successfully (${file.sourceMapPath})`);
            return file;
        })).then((file) => __awaiter(this, void 0, void 0, function* () {
            yield iOS.uploadSourcemap(file.sourceMapPath, file.minifiedPath, iosVersion);
            console.info(`Sourcemaps iOS uploaded successfully`);
            try {
                fs.unlinkSync(file.minifiedPath);
                fs.unlinkSync(file.sourceMapPath);
                console.info(`Sourcemaps iOS cleanup complete`);
            }
            catch (_a) {
            }
        }));
    });
}
function androidProcedure(releaseStage) {
    return __awaiter(this, void 0, void 0, function* () {
        let androidVersion;
        return Android.versionInfo().then((version) => __awaiter(this, void 0, void 0, function* () {
            yield reporter_1.default(version, releaseStage);
            androidVersion = version;
            console.info(`Release Android ${version.app_version} (${version.version_code}) reported successfully`);
        })).then(() => __awaiter(this, void 0, void 0, function* () {
            const file = yield Android.generateSourcemap();
            console.info(`Sourcemaps Android generated successfully (${file.sourceMapPath})`);
            return file;
        })).then((file) => __awaiter(this, void 0, void 0, function* () {
            yield Android.uploadSourcemap(file.sourceMapPath, file.minifiedPath, androidVersion);
            console.info(`Sourcemaps Android uploaded successfully`);
            try {
                fs.unlinkSync(file.minifiedPath);
                fs.unlinkSync(file.sourceMapPath);
                console.info(`Sourcemaps Android cleanup complete`);
            }
            catch (_a) {
            }
        }));
    });
}
//# sourceMappingURL=index.js.map