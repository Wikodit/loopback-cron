import {LoopbackCronApplication} from './application';
import slackIt from './utils/slackit.util';

const pkg = require('../package.json');

export async function migrate(args: string[]) {
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
  console.log('Migrating schemas (%s existing schema)', existingSchema);

  const app = new LoopbackCronApplication();
  await app.boot();
  await app.migrateSchema({existingSchema});

  // Connectors usually keep a pool of opened connections,
  // this keeps the process running even after all work is done.
  // We need to exit explicitly.
  process.exit(0);
}

migrate(process.argv)
  .then(async () => {
    await slackIt(
      [
        '> *Schema successfully migrated*',
        `> *Env:* ${process.env.NODE_ENV}`,
        `> *Url:* ${process.env.APP_URL}`,
        `> *Version:* ${pkg.version}`,
      ].join('\n'),
      ':heavy_check_mark:',
    );
    process.exit(0);
  })
  .catch(async err => {
    await slackIt(
      [
        '> *Error during schema migration*',
        `> *Env:* ${process.env.NODE_ENV}`,
        `> *Url:* ${process.env.APP_URL}`,
        `> *Version:* ${pkg.version}`,
        `> *Error:* ${err}`,
      ].join('\n'),
      ':x:',
    );
    console.error('Cannot migrate database schema', err);
    process.exit(1);
  });
