/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path'
import fs from 'fs'
import ts from 'rollup-plugin-typescript2'
import cjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'

const packagePath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

export const getPackagePath = (packageName, isDist) => {
    if (isDist) {
        return `${distPath}/${packageName}`;
    }
    return `${packagePath}/${packageName}`;
};

export const getPackageJSON = (packageName) => {
    const resolvePath = `${getPackagePath(packageName)}/package.json`;
    const str = fs.readFileSync(resolvePath, { encoding: 'utf-8' });
    return JSON.parse(str);

}

export const getBasePlugins = ({
    alias = {
        __DEV__: true
    },
    typescript = {}
} = {}) => {
    return [
        replace(alias),
        cjs(),
        ts(typescript)
    ]
}