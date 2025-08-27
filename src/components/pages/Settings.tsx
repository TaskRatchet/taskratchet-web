import { Box } from '@mui/material';

import useDocumentTitle from '../../lib/useDocumentTitle';
import ApiSettings from '../organisms/ApiSettings';
import BeeminderSettings from '../organisms/BeeminderSettings';
import GeneralSettings from '../organisms/GeneralSettings';
import PasswordSettings from '../organisms/PasswordSettings';
import PaymentSettings from '../organisms/PaymentSettings';

const Settings = (): JSX.Element => {
	useDocumentTitle('Settings | TaskRatchet');

	return (
		<Box sx={{ p: 2 }}>
			<h1>Settings</h1>

			<GeneralSettings />

			<h2>Reset Password</h2>

			<PasswordSettings />

			<h2>Update Payment Details</h2>

			<PaymentSettings />

			<h2>Beeminder Integration</h2>

			<BeeminderSettings />

			<h2>API</h2>

			<ApiSettings />
		</Box>
	);
};

export default Settings;
