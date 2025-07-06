import {must} from 'shared/must';
import 'shared/env';
import {exec} from 'shared/exec';

const devPgPassword = must(
  process.env.DEV_PG_PASSWORD,
  'DEV_PG_PASSWORD is required',
);

function main() {
  try {
    console.log('Attempting to start existing cardz container...');
    exec('docker start -a cardz');
    console.log('cardz container started.');
  } catch (error) {
    console.log(error.message);
    console.log(
      'Existing cardz container not found or could not be started. Creating a new one...',
    );
    try {
      exec(
        `docker run --rm --name cardz -e POSTGRES_PASSWORD=${devPgPassword} -p 5432:5432 postgres -c wal_level=logical`,
      );
    } catch (runError) {
      console.error('Failed to create and run new container:', runError);
    }
  }
}

main();
