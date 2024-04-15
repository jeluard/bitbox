// SEA only supports CJS
// Must only depend on built-in modules
const { exec } = require('node:child_process');
const { existsSync, mkdirSync, writeFileSync } = require('node:fs');
const { homedir } = require('node:os');
const { resolve } = require('node:path');
const { getAsset } = require('node:sea');
const { Script, constants } = require('node:vm');

// Extract the embedded package in user folder
const assetName = '%ASSET_NAME%';
const asset = getAsset(assetName);
if (asset === undefined) {
  throw Error(`Missing asset: ${assetName}`);
}
const packageName = "%PACKAGE_NAME%";
const packageVersion = "%PACKAGE_VERSION%";
const packageFolder = `${homedir()}/.bitbox/${packageName}/${packageVersion}`;
if (existsSync(packageFolder)) {
  console.log(`Running existing package ${packageFolder}`);
  runPackageScript();
} else {
  console.log(`Unpacking package into ${packageFolder}`);
  mkdirSync(packageFolder, { recursive: true });
  const assetPath = `${packageFolder}/${assetName}.tar.gz`;
  writeFileSync(assetPath, new Uint8Array(asset));
  
  const childProcess = exec(`tar -xf ${assetPath} -C ${packageFolder}`);
  childProcess.on('exit', function() {
    runPackageScript();
  });
}

function runPackageScript() {
  const dirname = process.cwd();
  const indexPath = `${packageFolder}/%ENTRY_POINT%`;
  if (!existsSync(indexPath)) {
    throw Error(`Missing index ${indexPath}`);
  }
  const script = new Script(
    `import('${indexPath}')`,
    {
      filename: resolve(dirname, 'bitbox.js'),
      importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
    });

  script.runInThisContext();
}

