import { vi } from 'vitest';

export function ClerkProvider({ children }: React.PropsWithChildren<unknown>) {
	return children;
}

export function Protect({ children }: React.PropsWithChildren<unknown>) {
	return children;
}

/**
 * Render a placeholder UI indicating a redirect to the sign-in page.
 *
 * @returns A JSX element that displays "Redirecting...".
 */
export function RedirectToSignIn(): JSX.Element {
	return <div>Redirecting...</div>;
}

/**
 * Displays a simple redirecting indicator for the sign-up flow.
 *
 * @returns A JSX element that renders the text "Redirecting...".
 */
export function RedirectToSignUp(): JSX.Element {
	return <div>Redirecting...</div>;
}

/**
 * Displays content intended for authenticated users.
 *
 * @returns A JSX element that renders the text "Signed In".
 */
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
