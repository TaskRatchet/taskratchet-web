declare module 'jest-mock-now'

type Session = {
    token: string,
    email: string
}

type Task = {
    complete: boolean,
    due: int,
    id: number,
    cents: number,
    task: string,
    charge_locked: int | null,
    charge_authorized: int | null,
    charge_captured: int | null,
}
