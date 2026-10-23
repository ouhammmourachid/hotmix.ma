import posthog from 'posthog-js';

const POSTHOG_PROJECT_TOKEN = 'phc_pLKBvryo96qKoB5EoNMQ5dgxGKpxvBfXDhvRo59Ez47P';
const PRODUCTION_HOSTS = ['www.hotmix.ma', 'hotmix.ma'];

// Keep localhost and Vercel preview traffic out of the production analytics project
const isProduction = PRODUCTION_HOSTS.includes(window.location.hostname);

posthog.init(POSTHOG_PROJECT_TOKEN, {
  api_host: 'https://us.i.posthog.com',
  // Opts into current recommended defaults, incl. automatic pageview/pageleave capture on client-side navigation
  defaults: '2025-05-24',
  capture_exceptions: true,
  opt_out_capturing_by_default: !isProduction,
});
