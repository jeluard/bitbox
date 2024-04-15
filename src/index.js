import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { argv, execPath, version } from "node:process";
import { build } from "./build.js";
import { bundle } from "./bundle.js";
import { inject } from "./inject/index.js";

const path = argv[2];
if (path === undefined){
    throw Error('Missing <pathName> argument');
}
const entryPoint = argv[3];
if (entryPoint === undefined){
    throw Error('Missing <entryPoint> argument');
}

const [major,minor] = version.replace("v", "").split(".").map(Number);
if (!(major >= 21 && minor >= 7)) {
    throw new Error("SEA requires Node.js 21.7.0 or later");
}

// Build the project
await build(path);
const targetFolder = "bitbox-build";
await mkdir(targetFolder, { recursive: true });

const binary = path.split("/").filter(s=>s).pop();
const assetPath = await bundle(targetFolder, path, binary);
// Copy the node binary used to run this program
const binaryPath = `${targetFolder}/${binary}`;
await copyFile(execPath, binaryPath);
// Inject into the binary the SEA configurations
const packageJson = JSON.parse(await readFile(`${path}/package.json`));
await inject(binaryPath, targetFolder, assetPath, packageJson, entryPoint);