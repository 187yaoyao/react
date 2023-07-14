/* eslint-disable prettier/prettier */
import { getPackageJSON, getPackagePath, getBasePlugins } from './utils';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import alias from '@rollup/plugin-alias';

const packagePath = getPackagePath('react-dom'),
    distPath = getPackagePath('react-dom', true),
    { name, module } = getPackageJSON('react-dom');

export default [
    {
        input: `${packagePath}/${module}`,
        output: [
            {
                format: 'umd',
                file: `${distPath}/index.js`,
                name: 'index.js'
            },
            {
                format: 'umd',
                file: `${distPath}/client.js`,
                name: 'client.js'
            }
        ],
        plugins: [...getBasePlugins(),
        generatePackageJson({
            inputFolder: packagePath,
            outputFolder: distPath,
            baseContents: ({ name, description, version }) => ({
                name,
                description,
                version,
                main: 'index.js',
                peerDependencies: {
                    react: version
                }
            })
        }), alias({
            entries: {
                h0stConfig: `${packagePath}/src/hostConfig.ts`
            }
        })]
    },

]