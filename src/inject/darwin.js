import { exec } from "../utils.js";

export async function inject(seaBlobPath, binaryPath) {
    await exec(`codesign --remove-signature ${binaryPath}`);

    await exec(`npx postject ${binaryPath} NODE_SEA_BLOB ${seaBlobPath} --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --macho-segment-name NODE_SEA`);

    await exec(`codesign --sign - ${binaryPath}`);
}