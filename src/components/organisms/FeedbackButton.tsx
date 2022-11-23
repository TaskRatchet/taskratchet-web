import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Tooltip,
	TextField,
	Alert,
	Stack,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import FeedbackIcon from '@mui/icons-material/Feedback';
import createTicket from '../../lib/createTicket';
import { useMe } from '../../lib/api/useMe';
import LoadingButton from '@mui/lab/LoadingButton';
import { useMutation } from 'react-query';

export default function FeedbackButton() {
	const { data } = useMe();

	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState(data?.email);
	const [message, setMessage] = useState('');
	const [validate, setValidate] = useState(false);

	useEffect(() => {
		if (email === undefined && data) {
			setEmail(data.email);
		}
	}, [data, email]);

	useEffect(() => {
		window.FreshworksWidget('hide', 'launcher');
	}, []);

	const mutation = useMutation(createTicket);

	return (
		<>
			<Tooltip title={'Feedback'}>
				<IconButton
					onClick={() => setOpen(true)}
					edge="start"
					color="inherit"
					aria-label="feedback"
					sx={{ m: 0.1 }}
				>
					<FeedbackIcon />
				</IconButton>
			</Tooltip>
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>Feedback</DialogTitle>
				<DialogContent dividers>
					<Stack spacing={2}>
						{mutation.isSuccess && (
							<Alert severity="success">Thank you for your feedback!</Alert>
						)}

						{mutation.isError && (
							<Alert severity="error">
								Oops! Something went wrong. Please send an email to
								support@taskratchet.com and include the following error:
								<br />
								<br />
								{mutation.error instanceof Error
									? mutation.error.message
									: JSON.stringify(mutation.error)}
							</Alert>
						)}

						<TextField
							label="Email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							fullWidth
							error={validate && !email}
							helperText={validate && !email && 'Required'}
						/>

						<TextField
							label="Message"
							autoFocus
							multiline
							value={message}
							onChange={(e) => {
								setMessage(e.target.value);
							}}
							required
							fullWidth
							error={validate && !message}
							helperText={validate && !message && 'Required'}
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setOpen(false);
						}}
					>
						Cancel
					</Button>
					<LoadingButton
						loading={mutation.isLoading}
						variant="contained"
						onClick={() => {
							setValidate(true);
							if (email && message) {
								mutation.mutate({
									description: message,
									unique_external_id: data?.id,
									email,
								});
							}
						}}
					>
						Submit
					</LoadingButton>
				</DialogActions>
			</Dialog>
		</>
	);
}
