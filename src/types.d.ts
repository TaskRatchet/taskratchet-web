type Status = 'pending' | 'complete' | 'expired';
type Filters = Record<Status, boolean>;

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
