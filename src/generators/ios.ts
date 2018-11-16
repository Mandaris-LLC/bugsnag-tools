export interface iOSVersionInfo {
    build: string
    app_version: string
}

export function versionInfo(): Promise<iOSVersionInfo> {
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