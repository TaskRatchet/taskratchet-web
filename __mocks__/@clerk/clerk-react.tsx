import { vi } from 'vitest';

export function ClerkProvider({ children }: React.PropsWithChildren<unknown>) {
	return children;
}

export function Protect({ children }: React.PropsWithChildren<unknown>) {
	return children;
}

export function RedirectToSignIn(): JSX.Element {
	return <div>Redirecting...</div>;
}

export function RedirectToSignUp(): JSX.Element {
	return <div>Redirecting...</div>;
}

export function SignedIn(): JSX.Element {
	return <div>Signed In</div>;
}

export function UserButton(): JSX.Element {
	return <div>User Button</div>;
}

export const useUser = vi.fn(() => ({
	isSignedIn: true,
	user: {},
}));

export const useClerk = vi.fn(() => ({
	session: null,
}));
