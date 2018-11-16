import reportBuild from 'bugsnag-build-reporter';
import { apiKey } from '..';
import { iOSVersionInfo } from './ios';
import { AndroidVersionInfo } from './android';

export default function reportRelease(version_code: iOSVersionInfo | AndroidVersionInfo, releaseStage: string): Promise<void> {
    if (isiOSVersionInfo(version_code)) {
        return reportBuild({ apiKey: apiKey, appVersion: version_code.app_version, appBundleVersion: version_code.build, releaseStage: releaseStage })
    } else {
        return reportBuild({ apiKey: apiKey, appVersion: version_code.app_version, appVersionCode: version_code.version_code, releaseStage: releaseStage })
    }
}

function isiOSVersionInfo(data: iOSVersionInfo | AndroidVersionInfo): data is iOSVersionInfo {
    if (data['build'] !== undefined) {
        return true
    }
    return false;
} 