import fs from 'fs/promises';

// https://rollupjs.org/guide/en/#configuration-files
export default async(commandLineArgs)=>{

  await fs.rm('./dist', { recursive: true, force: true });
  
  return [
    {
      input: "src/howler.core.js",
      output: [
        // index.mjs
        // for rollup/webpack to compile together with other
        // or use in <script type="module">
        {
          file: "dist/index.mjs",
          format: "es",
          exports: "named",
          sourcemap: true,
          plugins: [
            { 
              // https://rollupjs.org/guide/en/#writebundle
              async writeBundle(options, bundle){
                await fs.copyFile('./types/index.d.ts', './dist/index.d.ts');
                await fs.copyFile('./dist/index.mjs', './dist/index.esm.js');
              }
            },
          ],
        },
      ],
    },
  ]
};