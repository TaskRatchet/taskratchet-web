import { H } from 'highlight.run';

type Options = {
	userName?: string;
	userEmail?: string;
	prompt?: string;
	response: string;
};

export default function saveFeedback({ prompt, response }: Options): void {
	const verbatim = `${prompt ? `${prompt}: ` : ''}${response}`;

	H.addSessionFeedback({
		verbatim,
	});
}
