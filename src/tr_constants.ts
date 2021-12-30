export const hostname = window && window.location && window.location.hostname;
export const isProduction = hostname === 'app.taskratchet.com';
export const isStaging = hostname === 'staging.taskratchet.com';
