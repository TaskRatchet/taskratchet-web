import { IconButton, Tooltip } from '@mui/material';
import React, { useEffect } from 'react';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { useMe } from '../../lib/api/useMe';

export default function FeedbackButton() {
	useMe({
		onSuccess: (data) => {
			console.log('identifying', data);
			window.FreshworksWidget('identify', 'ticketForm', {
				name: data.name,
				email: data.email,
			});
			window.FreshworksWidget('prefill', 'ticketForm', {
				custom_fields: data,
			});
		},
	});

	useEffect(() => {
		window.FreshworksWidget('hide', 'launcher');
	}, []);

	return (
		<>
			<Tooltip title={'Feedback'}>
				<IconButton
					onClick={() => {
						window.FreshworksWidget('open');
					}}
					edge="start"
					color="inherit"
					aria-label="feedback"
					sx={{ m: 0.1 }}
				>
					<FeedbackIcon />
				</IconButton>
			</Tooltip>
		</>
	);
}
