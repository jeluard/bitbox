import { readFile, writeFile } from "node:fs/promises";
import { platform } from "node:os";
import { exec } from "../utils.js";

async function createMainFile(packageJson, assetName, entryPoint) {
    return (await readFile("./resources/vm.mjs")).toString()
        .replace("%PACKAGE_NAME%", packageJson.name)
        .replace("%PACKAGE_VERSION%", packageJson.version)
        .replace("%ASSET_NAME%", assetName)
        .replace("%ENTRY_POINT%", entryPoint);
}

async function writeSeaConfig(targetFolder, configPath, outputPath, assetPath, packageJson, entryPoint) {
    const mainPath = `${targetFolder}/vm.mjs`;
    const assetName = "package";
    await writeFile(mainPath, await createMainFile(packageJson, assetName, entryPoint));
    const seaConfig = {
        "main": mainPath,
        "output": outputPath,
        "disableExperimentalSEAWarning": true,
        "useSnapshot": false,
        "useCodeCache": true,
        "assets": {
            [assetName]: assetPath,
        }
    } ;
    await writeFile(configPath, JSON.stringify(seaConfig));
}

export async function inject(binaryPath, targetFolder, assetPath, packageJson, entryPoint) {
    const seaConfigPath = `${targetFolder}/sea-config.json`;
    const seaBlobPath = `${targetFolder}/sea-config.blob`;
    await writeSeaConfig(targetFolder, seaConfigPath, seaBlobPath, assetPath, packageJson, entryPoint);
    await exec(`node --experimental-sea-config ${seaConfigPath}`);

    switch (platform()) {
        case "darwin":
            return (await import("./darwin.js")).inject(seaBlobPath, binaryPath);
        case "linux":
            return (await import("./linux.js")).inject(seaBlobPath, binaryPath);
        default:
            throw new Error("Unsupported platform");
    }
}