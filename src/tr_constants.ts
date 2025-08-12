const HOSTNAME = window && window.location && window.location.hostname;

export const IS_PRODUCTION = HOSTNAME === 'app.taskratchet.com';
