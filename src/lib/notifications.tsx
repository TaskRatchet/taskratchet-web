const isSupported = () => "Notification" in window

const isPermissionGranted = () => Notification.permission === "granted"

const isPermissionDenied = () => Notification.permission === "denied"

const requestPermission = async () => {
    const permission =  await Notification.requestPermission()

    return permission === "granted"
}

const notify = async (message: string) => {
    if (!isSupported()) {
        throw Error('Notification API not supported')
    }

    if (isPermissionDenied()) {
        throw Error('Permission denied')
    }

    const permissionGranted = isPermissionGranted()
        || await requestPermission()

    if (!permissionGranted) {
        throw Error('Permission denied')
    }

    return new Notification(message)
}

export default notify
