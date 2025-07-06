import {exec} from 'shared/exec';

console.log('Cleaning up resources...');

try {
  exec('rm -f /tmp/cardz.db*');
} catch (err) {
  console.info(err.message);
}

try {
  exec('docker rm -f cardz');
} catch (err) {
  console.info(err.message);
}

console.log('Cleanup complete.');
