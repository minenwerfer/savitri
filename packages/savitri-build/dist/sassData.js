"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sassData = void 0;
const DEFAULT_THEMES = [
    'default',
    'dark',
    'contrast'
];
const sassData = (config) => {
    const { themes = DEFAULT_THEMES, scssRoot = 'node_modules/@savitri/ui/dist/scss' } = config;
    const lines = [];
    lines.push(`@import '${scssRoot}/_theming.scss'`);
    lines.push(`$themes: ${themes.join(',')}`);
    return lines.join('\n;') + ';';
};
exports.sassData = sassData;
