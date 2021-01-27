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
    status: 'pending' | 'complete' | 'expired',
}
