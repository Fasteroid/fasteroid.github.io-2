import manifest from "./manifest.json";
export function link(oldPath: string): string {
    console.log(manifest.start_url + oldPath)
    return manifest.start_url + oldPath
}