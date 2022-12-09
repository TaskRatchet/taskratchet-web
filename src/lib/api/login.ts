import { publishSession } from './useSession';
import fetch1 from './fetch1';
import logEvent from '../logEvent';
import { EventCategory, EventAction } from '../logEvent';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: __FIREBASE_API_KEY__,
	authDomain: __FIREBASE_AUTH_DOMAIN__,
	databaseURL: __FIREBASE_DATABASE_URL__,
	projectId: __FIREBASE_PROJECT_ID__,
	storageBucket: __FIREBASE_STORAGE_BUCKET__,
	messagingSenderId: __FIREBASE_MESSAGING_SENDER_ID__,
	appId: __FIREBASE_APP_ID__,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export async function login(email: string, password: string): Promise<boolean> {
	const res = await fetch1('account/login', false, 'POST', {
		email,
		password,
	});

	if (!res.ok) return false;

	const token = await res.text();

	window.localStorage.setItem('token', token);
	window.localStorage.setItem('email', email);

	const cred = await signInWithEmailAndPassword(auth, email, password);

	window.localStorage.setItem('firebase_token', await cred.user.getIdToken());

	publishSession();

	logEvent({
		category: EventCategory.Authentication,
		action: EventAction.Login,
	});

	return true;
}
