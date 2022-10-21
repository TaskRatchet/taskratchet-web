import ga from './ga';

export enum EventCategory {
	Authentication = 'Authentication',
	Task = 'Task',
	User = 'User',
}

export enum EventAction {
	Login = 'Login',
	Logout = 'Logout',
	PasswordResetRequest = 'PasswordResetRequest',
	PasswordReset = 'PasswordReset',
	PasswordUpdate = 'PasswordUpdate',
	Signup = 'Signup',
	TaskCreate = 'TaskCreate',
	TaskCopy = 'TaskCopy',
	TaskComplete = 'TaskComplete',
	TaskUncle = 'TaskUncle',
	TaskUpdate = 'TaskUpdate',
	UserUpdate = 'UserUpdate',
}

type GaEvent =
	| {
			category: EventCategory.Authentication;
			action:
				| EventAction.Login
				| EventAction.Logout
				| EventAction.PasswordResetRequest
				| EventAction.PasswordReset
				| EventAction.PasswordUpdate
				| EventAction.Signup;
	  }
	| {
			category: EventCategory.Task;
			action: EventAction.TaskCreate | EventAction.TaskCopy;
			value: number;
	  }
	| {
			category: EventCategory.Task;
			action:
				| EventAction.TaskComplete
				| EventAction.TaskUncle
				| EventAction.TaskUpdate;
			value?: number;
	  }
	| {
			category: EventCategory.User;
			action: EventAction.UserUpdate;
	  };

export default function logEvent(event: GaEvent) {
	ga.event(event);
}
