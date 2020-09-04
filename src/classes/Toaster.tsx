import { toast } from 'react-toastify';

class Toaster {
    send(msg: string) {
        toast(msg, {autoClose: false})
    }
}

const toaster = new Toaster()

export default toaster;
