export interface iOSVersionInfo {
    build: string;
    app_version: string;
}
export declare function versionInfo(): Promise<iOSVersionInfo>;
export declare function generateSourcemap(): Promise<{
    minifiedPath: string;
    sourceMapPath: string;
}>;
export declare function uploadSourcemap(sourceMap: string, minifiedFile: string, version: iOSVersionInfo): Promise<any>;
