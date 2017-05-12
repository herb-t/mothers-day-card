// Hack: npm run has poor cross-platform env var support.
if (process.env.DEBUG === undefined) process.env.DEBUG = 'build:*';

const debug = require('debug')('build:rollup');
const rollup = require('rollup');
const {watch, args, isModern} = require('./build-util');

if (args.prod) debug('using prod config');

const config = args.prod
  ? require('./rollup.config-prod')
  : require('./rollup.config-dev');

let cache;
let building = false;
let modern;

function build() {
  if (building) return; // block builds until they finish

  debug('bundling');

  building = true;

  config.cache = cache;

  const _config = Object.assign({}, config);
  const _modern = isModern();

  if (modern !== _modern) _config.cache = undefined;
  modern = _modern;

  if (!args.prod && _modern) {
    _config.plugins = config.plugins.filter(({name}) => name !== 'babel');
  }

  return rollup
    .rollup(_config)
    .then(function(bundle) {
      cache = bundle;
      return bundle.write(_config);
    })
    .then(done, error);
}

function done() {
  debug(`bundled`);
  building = false;
}

function error(err) {
  debug('error while bundling:\n' + (err.stack || err.message));
  cache = undefined;
  building = false;
}

if (args.watch) {
  watch('src', {include: /(js)$/gi}, build);
  watch('package.json', build);
}

build();
