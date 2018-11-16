
declare function reportBuild(build: BuildInfo, options?: Options): Promise<void>
export = reportBuild;

interface SourceControlInfo {
    provider?: 'github' | 'github-enterprise' | 'gitlab' | 'gitlab-onpremise' | 'bitbucket' | 'bitbucket-server'
    repository?: string
    revision?: string
}

interface BuildInfo {
    apiKey: string
    appVersion: string
    releaseStage?: string
    sourceControl?: SourceControlInfo
    builderName?: string
    autoAssignRelease?: boolean
    appVersionCode?: string
    appBundleVersion?: string
}

interface Logger {
    debug(...args: any[])
    info(...args: any[])
    warn(...args: any[])
    error(...args: any[])
}

interface Options {
    logLevel?: 'debug' | 'info' | 'warn' | 'error'
    logger?: Logger
    path?: string
    endpoint?: string
}

