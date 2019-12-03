"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reportBuild = require("bugsnag-build-reporter");
const __1 = require("..");
function reportRelease(version_code, releaseStage) {
    if (isiOSVersionInfo(version_code)) {
        return reportBuild({ apiKey: __1.apiKey, appVersion: version_code.app_version, appBundleVersion: version_code.build, releaseStage: releaseStage });
    }
    else {
        return reportBuild({ apiKey: __1.apiKey, appVersion: version_code.app_version, appVersionCode: version_code.version_code, releaseStage: releaseStage });
    }
}
exports.default = reportRelease;
function isiOSVersionInfo(data) {
    if (data['build'] !== undefined) {
        return true;
    }
    return false;
}
//# sourceMappingURL=reporter.js.map