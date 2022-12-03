import { publishSession } from './useSession';
import fetch1 from './fetch1';
<<<<<<< Updated upstream
=======
import logEvent from '../logEvent';
import { EventCategory, EventAction } from '../logEvent';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
>>>>>>> Stashed changes

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDLmrZHMO0e0t9fUNOyI5ixpl2j-mRNTA8',
	authDomain: 'taskratchet-dev.firebaseapp.com',
	databaseURL: 'https://taskratchet-dev.firebaseio.com',
	projectId: 'taskratchet-dev',
	storageBucket: 'taskratchet-dev.appspot.com',
	messagingSenderId: '1073811542141',
	appId: '1:1073811542141:web:62a74298b7a3b27cc3e114',
};

<<<<<<< Updated upstream
		return true;
=======
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export async function login(email: string, password: string): Promise<boolean> {
	// const cred = await signInWithEmailAndPassword(auth, email, password);

	// window.localStorage.setItem('firebase_token', await cred.user.getIdToken());

	const res = await fetch1('account/login', false, 'POST', {
		email,
		password,
>>>>>>> Stashed changes
	});

	if (!res.ok) return false;

	void res.text().then((token: string) => _handleLoginResponse(email, token));

	logEvent({
		category: EventCategory.Authentication,
		action: EventAction.Login,
	});

	return true;
}

function _handleLoginResponse(email: string, token: string): void {
	window.localStorage.setItem('token', token);
	window.localStorage.setItem('email', email);

	publishSession();
}
