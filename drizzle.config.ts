import {defineConfig} from 'drizzle-kit';
import {must} from './shared/must';
import './shared/env';

const pgURL = must(process.env.PG_URL, 'PG_URL is required');

export default defineConfig({
  out: './backend/db/migrations',
  schema: './backend/db/schema.ts',
  dialect: 'postgresql',
  strict: true,
  dbCredentials: {
    url: pgURL,
  },
});
