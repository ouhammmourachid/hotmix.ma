import posthog from 'posthog-js';

const POSTHOG_PROJECT_TOKEN = 'phc_pLKBvryo96qKoB5EoNMQ5dgxGKpxvBfXDhvRo59Ez47P';

posthog.init(POSTHOG_PROJECT_TOKEN, {
  api_host: 'https://us.i.posthog.com',
  // Opts into current recommended defaults, incl. automatic pageview/pageleave capture on client-side navigation
  defaults: '2025-05-24',
});
