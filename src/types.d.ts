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
	id: string;
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
	id?: string;
	isNew?: boolean;
	due_timestamp?: number;
	due: string;
	cents: number;
	task: string;
	complete: boolean;
	status: Status;
	timezone: string;
	recurrence?: Record<string, number>;
};

type RecurringTaskInput = Omit<TaskInput, 'due'>;
type RecurringTask = Omit<TaskType, 'due'> & { id: string };

type TaskInput = {
	task: string;
	due: string;
	cents: number;
	recurrence?: Record<string, number>;
};
