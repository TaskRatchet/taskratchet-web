import React, {useEffect, useState} from 'react';
import api from '../../lib/Api';
import './Account.css'
import toaster from "../../lib/Toaster";
import Input from "../molecules/Input";
import BeeminderSettings from "../organisms/BeeminderSettings";

interface Card {
    brand: string,
    last4: string,
}

interface CheckoutSession {
    id: string
}

interface AccountProps {
}

const Account = (props: AccountProps) => {
    const [checkoutSession, setCheckoutSession] = useState<CheckoutSession | null>(null),
        [timezones, setTimezones] = useState<string[]>([]),
        [name, setName] = useState<string>(''),
        [email, setEmail] = useState<string>(''),
        [timezone, setTimezone] = useState<string>(''),
        [cards, setCards] = useState<Card[]>([]),
        [oldPassword, setOldPassword] = useState<string>(''),
        [password, setPassword] = useState<string>(''),
        [password2, setPassword2] = useState<string>('');

    useEffect(() => {
        const populateTimezones = () => {
            api.getTimezones()
                .then((res: any) => res.json())
                .then(setTimezones);
        };

        const loadUser = () => {
            api.getMe()
                .then((res: any) => res.json())
                .then(loadResponseData)
        };

        const loadCheckoutSession = () => {
            api.getCheckoutSession()
                .then((res: any) => res.json())
                .then(setCheckoutSession)
        };

        populateTimezones();
        loadUser();
        loadCheckoutSession();
    }, []);

    const loadResponseData = (data: any) => {
        setName(data['name']);
        setEmail(data['email']);
        setTimezone(data['timezone']);
        setCards(data['cards']);
    };

    const saveGeneral = (event: any) => {
        event.preventDefault();

        api.updateMe({
            name: prepareValue(name),
            email: prepareValue(email),
            timezone: prepareValue(timezone)
        }).then((res: Response) => {
            if (res.ok) {
                toaster.send('Changes saved');

                res.json().then(loadResponseData)
            } else {
                res.text().then((error: string) => {
                    toaster.send(`Something went wrong: ${error}`);
                })
            }
        })
    };

    const prepareValue = (value: string) => {
        return (value === '') ? null : value;
    };

    const savePassword = (event: any) => {
        event.preventDefault();

        if (!isPasswordFormValid()) return;

        api.updatePassword(oldPassword, password)
            .then((res: any) => {
                toaster.send((res.ok) ? 'Password saved' : 'Something went wrong');
            });
    };

    const isPasswordFormValid = () => {
        let passed = true;

        if (oldPassword === '') {
            toaster.send('Old password required');
            passed = false;
        }

        if (password === '') {
            toaster.send('New password required');
            passed = false;
        }

        if (password !== password2) {
            toaster.send('New password fields don\'t match');
            passed = false;
        }

        return passed;
    };

    const updatePaymentDetails = () => {
        const sessionId = getSessionId();

        if (sessionId === null) {
            toaster.send('Checkout session error');
            return;
        }

        api.updateCheckoutSessionId(sessionId);

        redirect();
    };

    const redirect = () => {
        if (checkoutSession == null) return;

        const stripe = window.Stripe(window.stripe_key);

        stripe.redirectToCheckout({
            sessionId: getSessionId()
        }).then((result: any) => {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`.
            toaster.send(result.error.message);

            console.log('Checkout redirect error');
            console.log(result);
        });
    };

    const getSessionId = () => {
        if (checkoutSession == null) return null;

        return checkoutSession.id;
    };

    return <div className={'page-account'}>
        <h1>Account</h1>

        <form onSubmit={saveGeneral}>
            <label htmlFor="name">Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id={'name'}
                name={'name'}
            />

            <label htmlFor="email">Email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id={'email'}
                name={'email'}
            />

            <label htmlFor="timezone">Timezone</label>
            <select
                id={'timezone'}
                name="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
            >
                {timezones.map((tz, i) => <option value={tz} key={i}>{tz}</option>)}
            </select>

            <input type="submit" value={'Save'}/>
        </form>

        <h2>Reset Password</h2>

        <form onSubmit={savePassword}>
            <Input
                id={'old_password'}
                label={"Old Password"}
                onChange={e => setOldPassword(e.target.value)}
                value={oldPassword}
                type={"password"}
            />

            <Input
                id={'password'}
                label={'New Password'}
                onChange={e => setPassword(e.target.value)}
                value={password}
                type={'password'}
            />

            <Input
                id={'password2'}
                label={'Retype Password'}
                onChange={e => setPassword2(e.target.value)}
                value={password2}
                type={'password'}
            />

            <input type="submit" value={'Save'}/>
        </form>

        <h2>Update Payment Details</h2>

        <p>Saved payment method:</p>

        {cards ? <ul>
            {cards.map((c, i) => <li key={i}>{c.brand} ending with {c.last4}</li>)}
        </ul> : <p>None</p>}

        <button onClick={updatePaymentDetails}>Replace payment method</button>

        <h2>Beeminder Integration</h2>

        <BeeminderSettings />
    </div>
}

export default Account;
