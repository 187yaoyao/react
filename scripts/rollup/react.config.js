/* eslint-disable prettier/prettier */
import { getPackageJSON, getPackagePath, getBasePlugins } from './utils';
import generatePackageJson from 'rollup-plugin-generate-package-json';

const packagePath = getPackagePath('react'),
    distPath = getPackagePath('react', true),
    { name, module } = getPackageJSON('react');

export default [
    {
        input: `${packagePath}/${module}`,
        output: {
            format: 'umd',
            file: `${distPath}/index.js`,
            name: 'index.js'
        },
        plugins: [...getBasePlugins(), generatePackageJson({
            inputFolder: packagePath,
            outputFolder: distPath,
            baseContents: ({ name, description, version }) => ({
                name,
                description,
                version,
                main: 'index.js'
            })
        })]
    },
    {
        input: `${packagePath}/src/jsx.ts`,
        output: [
            {
                file: `${distPath}/jsx-runtime.js`,
                name: 'jsx-runtime.js',
                format: 'umd'
            },
            {
                file: `${distPath}/jsx-dev-runtime.js`,
                name: 'jsx-dev-runtime.js',
                format: 'umd'
            }
        ],
        plugins: getBasePlugins()
    }
]