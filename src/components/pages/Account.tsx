import React from 'react';
import './Account.css';
import BeeminderSettings from '../organisms/BeeminderSettings';
import ApiSettings from '../organisms/ApiSettings';
import GeneralSettings from '../organisms/GeneralSettings';
import PasswordSettings from '../organisms/PasswordSettings';
import PaymentSettings from '../organisms/PaymentSettings';

const Account = (): JSX.Element => {
	return (
		<div className={`page-account`}>
			<h1>Account</h1>

			<GeneralSettings />

			<h2>Reset Password</h2>

			<PasswordSettings />

			<h2>Update Payment Details</h2>

			<PaymentSettings />

			<h2>Beeminder Integration</h2>

			<BeeminderSettings />

			<h2>API</h2>

			<ApiSettings />
		</div>
	);
};

export default Account;
