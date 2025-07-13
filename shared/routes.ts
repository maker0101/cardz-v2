export const PAGE_ROUTES = {
  Home: '/',
  Study: '/study',
  Cards: '/cards',
  Progress: '/progress',
  Settings: '/settings',
} as const;

export const API_ROUTES = {
  Cards: {
    Generate: '/api/cards/generate',
  },
} as const;
