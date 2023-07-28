import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs/promises';
import packageDefinition from '../package.json' assert { type: "json" };

const [,,version] = process.argv;
if (version === undefined || !version.match(/^\d+.\d+.\d+$/)) {
    console.log(`ERROR: Not a valid version '${version}'`);
    process.exit(1);
}

// Delete obsolete flags that only clutter the file
delete packageDefinition.scripts;
delete packageDefinition.devDependencies;

// Build a new definition object to take control of the property ordering
const releasePackageDefinition = {
    name: packageDefinition.name,
    version,
    ...packageDefinition
};

// Write file
const packageDefinitionFilePath = resolve(dirname(fileURLToPath(import.meta.url)), '../package.json');
await fs.writeFile(packageDefinitionFilePath, JSON.stringify(releasePackageDefinition, null, '    '));

console.log(`OK: Release ${version}`);