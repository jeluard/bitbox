import { exec } from "../utils.js";

export async function generate(seaBlobPath, binaryPath) {
    await exec(`npx postject ${binaryPath} NODE_SEA_BLOB ${seaBlobPath} --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2`);
}