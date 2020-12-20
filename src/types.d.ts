type Session = {
    token: string,
    email: string
}

type TaskType = {
    due: int,
    cents: number,
    task: string,
    complete?: boolean,
    id?: number | string,
    charge_locked?: int | null,
    charge_authorized?: int | null,
    charge_captured?: int | null,
    charge_email_sent?: boolean
}
