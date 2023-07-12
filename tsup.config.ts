import { defineConfig } from 'tsup';
import { resolve, join } from 'path';

export default defineConfig({
    entry: ['src/index.ts'],
    splitting: false,
    sourcemap: false,
    clean: true,
    format: 'esm',
    dts: true,
    esbuildPlugins: [
        {
            name: 'add-local-imports-extension',
            setup(build) {
                // Add .ts extension to all local files that don't have it yet
                build.onResolve({filter: /^\.\//}, args => ({
                    path: resolve(join(args.resolveDir, args.path.endsWith('.ts') ? args.path : `${args.path}.ts`),)
                }))
            }
        }
    ]
})
