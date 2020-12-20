const execa = require('execa');
const { fuzzyMatchTarget } = require('./utils');
const args = require('minimist')(process.argv.slice(2));
const target = args._.length
  ? fuzzyMatchTarget(args._)[0]
  : 'component-studio-ui';
const sourceMap = args.sourcemap || args.s || true;
const formats = args.format || args.f || 'es';

if (target === 'component-studio-ui') {
  return execa('yarn', ['workspace', 'component-studio-ui', 'start'], {
    stdio: 'inherit',
  });
} else {
  return execa(
    'rollup',
    [
      '-wc',
      '--environment',
      [
        `TARGET:${target}`,
        `FORMATS:${formats}`,
        sourceMap ? `SOURCE_MAP:true` : ``,
      ]
        .filter(Boolean)
        .join(','),
    ],
    {
      stdio: 'inherit',
    },
  );
}
