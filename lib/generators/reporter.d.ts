import { iOSVersionInfo } from './ios';
import { AndroidVersionInfo } from './android';
export default function reportRelease(version_code: iOSVersionInfo | AndroidVersionInfo, releaseStage: string): Promise<void>;
