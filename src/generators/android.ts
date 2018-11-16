export interface AndroidVersionInfo {
    app_version: string;
    version_code: string;
}

export function versionInfo(): Promise<AndroidVersionInfo> {
    return new Promise((resolve, reject) => {

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