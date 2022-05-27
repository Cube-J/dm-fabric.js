import fs from 'fs/promises';

// https://rollupjs.org/guide/en/#configuration-files
export default async(commandLineArgs)=>{

  await fs.rm('./dist', { recursive: true, force: true });
  
  return [
    {
      input: "src/index.js",
      output: [
        // index.mjs
        // for rollup/webpack to compile together with other
        // or use in <script type="module">
        {
          file: "dist/fabric.mjs",
          format: "es",
          exports: "named",
          sourcemap: true,
          plugins: [
            { 
              // https://rollupjs.org/guide/en/#writebundle
              async writeBundle(options, bundle){
                await fs.copyFile('./src/types/index.d.ts', './dist/index.d.ts');
                await fs.copyFile('./src/types/fabric-impl.d.ts', './dist/fabric-impl.d.ts');
                await fs.copyFile('./dist/fabric.mjs', './dist/fabric.esm.js');
              }
            },
          ],
        },
        {
          file: "dist/fabric.js",
          format: "umd",
          name: "DM",
          exports: "named",
          sourcemap: true,
        },
      ],
    },
  ]
};