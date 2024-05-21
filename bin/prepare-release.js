// This script prepares the release by setting the release version and exported build files
// to the package.json. It also cleans up some release-obsolete properties, like `scripts`
// or `devDependencies`

import {resolve, dirname, parse, format} from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs/promises';
import packageDefinition from '../package.json' with { type: "json" };
import buildMeta from '../dist/metafile-esm.json' with { type: "json" };

const [,,version] = process.argv;

// Fail if any of these conditions are not met
assert(version !== undefined && version.match(/^\d+.\d+.\d+$/), `ERROR: Not a valid version '${version}'`);
assert(packageDefinition.version === undefined, `ERROR: 'version' is already defined in package.json`);
assert(packageDefinition.files === undefined, `ERROR: 'files' is already defined in package.json`);



// Delete obsolete flags that only clutter the file
delete packageDefinition.scripts;
delete packageDefinition.devDependencies;

// Build a new definition object to take control of the property ordering
const releasePackageDefinition = {
    name: packageDefinition.name,
    version,
    ...packageDefinition,
    files: (await collectDistFiles()),
};


// Write file
const packageDefinitionFilePath = buildAppPath('/dist/package.json');
await fs.writeFile(packageDefinitionFilePath, JSON.stringify(releasePackageDefinition, null, '    '));

console.log(`OK: Release ${version}`);


function buildAppPath (path) {
    return resolve(dirname(fileURLToPath(import.meta.url)), '../' + path);
}

function replaceExt (path, ext) {
    const parts = parse(path);

    return format({...parts, ext, base: undefined});
}

function assert (assertion, errorMessage) {
    if (!!assertion !== true) {
        console.log(errorMessage);
        process.exit(1);
    }
}

async function collectDistFiles () {
    return (await fs.readdir(buildAppPath('/dist'), {withFileTypes: true}))
        .filter(dirent => dirent.isFile())
        .map(file => file.name);
}