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
};

type TaskInput = {
	task: string;
	due: string;
	cents: number;
};

enum TicketSource {
	EMAIL = 1,
	PORTAL = 2,
	PHONE = 3,
	CHAT = 7,
	FEEDBACK_WIDGET = 9,
	OUTBOUND_EMAIL = 10,
}

enum TicketStatus {
	OPEN = 2,
	PENDING = 3,
	RESOLVED = 4,
	CLOSED = 5,
}

enum TicketPriority {
	LOW = 1,
	MEDIUM = 2,
	HIGH = 3,
	URGENT = 4,
}

type TicketInput = {
	name?: string;
	subject?: string;
	type?: string;
	status?: TicketStatus;
	priority?: TicketPriority;
	description?: string;
	responder_id?: number;
	attachments?: Array<unknown>;
	cc_emails?: Array<string>;
	custom_fields?: Record<string, string>;
	due_by?: string;
	email_config_id?: number;
	fr_due_by?: string;
	group_id?: number;
	product_id?: number;
	source?: TicketSource;
	tags?: Array<string>;
	company_id?: number;
	internal_agent_id?: number;
	internal_group_id?: number;
} & (
	| { requester_id: number }
	| { email: string }
	| { facebook_id: string }
	| { phone: string }
	| { twitter_id: string }
	| { unique_external_id: string }
);
