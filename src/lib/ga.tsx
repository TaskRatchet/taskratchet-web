import ReactGA from 'react-ga4';
import { IS_PRODUCTION } from '../tr_constants';

ReactGA.initialize('G-Y074NE79ML', {
	gtagOptions: {
		debug_mode: !IS_PRODUCTION,
	},
});

export default ReactGA;
