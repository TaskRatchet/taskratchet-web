type Session = {
	token: string;
	email: string;
};

interface CheckoutSession {
	id: string;
}

type Status = 'pending' | 'complete' | 'expired';
type Filters = Record<Status, boolean>;

type Card = {
	brand: string;
	last4: string;
};

type User = {
	name: string;
	email: string;
	timezone: string;
	cards: Card[];
	integrations: {
		beeminder: {
			user: string;
			goal_new_tasks: string;
		};
	};
};

type TaskType = {
	due: int;
	cents: number;
	task: string;
	complete?: boolean;
	id?: number | string;
	status: Status;
	isNew?: boolean;
};
