import { createWriteStream, existsSync, rm } from "node:fs";
import { cp } from "node:fs/promises";
import { finished } from "node:stream/promises";
import archiver from "archiver";

export async function bundle(targetFolder, path, binary) {
    const packageFolder = `${targetFolder}/package`;
    if (existsSync(packageFolder)) {
        await rm(packageFolder, {recursive: true, force: true}, console.error);
    }
    await cp(path, packageFolder, {force: true, recursive: true, filter: (src) => !src.includes(".git")});
    const archive = archiver("tar", { gzip: true, zlib: { level: 9 } });
    const archiveName = `./${targetFolder}/${binary}.tar.gz`;
    const archiveStream = createWriteStream(archiveName);
    archive.pipe(archiveStream);
    archive.directory(`./${path}`, false);
    await archive.finalize();
    await finished(archiveStream);
    return archiveName;
}