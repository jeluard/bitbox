import { exec } from "./utils.js";

export async function build(path) {
    await exec(`yarn --cwd ${path} && yarn --cwd ${path} build && yarn --cwd ${path} install --production`);
}