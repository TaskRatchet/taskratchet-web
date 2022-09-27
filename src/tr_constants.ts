export const HOSTNAME = window && window.location && window.location.hostname;
export const IS_PRODUCTION = HOSTNAME === 'app.taskratchet.com';
export const IS_STAGING = HOSTNAME.includes('deploy-preview');
