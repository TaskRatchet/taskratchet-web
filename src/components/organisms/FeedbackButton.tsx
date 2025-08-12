import FeedbackIcon from '@mui/icons-material/Feedback';
import { IconButton, Tooltip } from '@mui/material';

export default function FeedbackButton() {
	return (
		<Tooltip title={'Contact'}>
			<IconButton
				component="a"
				href="https://docs.taskratchet.com/contact.html"
				target="_blank"
				rel="noopener noreferrer"
				edge="start"
				color="inherit"
				aria-label="contact"
				sx={{ m: 0.1 }}
			>
				<FeedbackIcon />
			</IconButton>
		</Tooltip>
	);
}
