type Status = 'pending' | 'complete' | 'expired';
type Filters = Record<Status, boolean>;

type TaskType = {
	id: string;
	isNew?: boolean;
	task: string;
	due: number;
	cents: number;
	complete: boolean;
	status: 'pending' | 'complete' | 'expired';
	chargeStatus?: 'notified' | 'authorized' | 'captured';
	contested?: boolean;
};

type TaskInput = {
	task: string;
	due: number;
	cents: number;
};
