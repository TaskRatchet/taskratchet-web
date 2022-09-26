export const hostname = window && window.location && window.location.hostname;
export const isProduction = hostname === 'app.taskratchet.com';
export const isStaging = hostname.includes('deploy-preview');
export const api1Production = 'https://api.taskratchet.com/api1/';
export const api1Staging =
	'https://taskratchet-api-node-c3yk2gl5eq-uc.a.run.app/api1/';
export const api1Local = 'http://localhost:8081/api1/';
export const api2Production = 'https://api.taskratchet.com/api2/';
export const api2Staging =
	'https://taskratchet-api-node-c3yk2gl5eq-uc.a.run.app/api2/';
export const api2Local = 'http://localhost:8081/api2/';
