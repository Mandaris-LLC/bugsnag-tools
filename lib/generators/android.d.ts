export interface AndroidVersionInfo {
    app_version: string;
    version_code: string;
}
export declare function versionInfo(): Promise<AndroidVersionInfo>;
export declare function generateSourcemap(): Promise<{
    minifiedPath: string;
    sourceMapPath: string;
}>;
export declare function uploadSourcemap(sourceMap: string, minifiedFile: string, version: AndroidVersionInfo): Promise<any>;
