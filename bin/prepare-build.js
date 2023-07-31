// This file compiles export files for all calendar components, properties, parameters and value types
import fs from 'fs/promises';
import {dirname, basename, resolve, parse, format} from 'path';
import {fileURLToPath} from 'url';

await exportBundle('Parser/Components', 'src/Components.ts');
await exportBundle('Parser/Properties', 'src/Properties.ts');
await exportBundle('Parser/Parameters', 'src/Parameters.ts');
await exportBundle('Parser/ValueTypes', 'src/ValueTypes.ts');

console.log('All OK');

async function exportBundle (dirFromAppSrc) {
    dirFromAppSrc = dirFromAppSrc.trimEnd('/');
    const files = (await fs.readdir(buildAppPath(`src/${dirFromAppSrc}`)))
    .filter(file => !file.startsWith('.')) // no hidden files
    .map(async file => {
        let exports;
        const path = parse(file);

        // Check if keyword `export default` exists in file to see whether we have to map the default
        if ((await fs.readFile(buildAppPath(`src/${dirFromAppSrc}/${file}`), 'utf8')).includes('export default')) {
            exports = `default as ${path.name}`;
        } else {
            exports = path.name;
        }

        return `export { ${exports} } from '${format({...path, ext: undefined, base: undefined, dir: `./${dirFromAppSrc}`})}';`;
    });

    const target = buildAppPath(`src/${basename(dirFromAppSrc)}.ts`)
    await fs.writeFile(target, (await Promise.all(files)).join("\n"), 'utf8');

    console.log(`OK: ${target}`);
}

function buildAppPath (path) {
    return resolve(dirname(fileURLToPath(import.meta.url)), '../' + path);
}