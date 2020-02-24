import { toast } from 'react-toastify';

class Toaster {
    send(msg: string) {
        toast(msg)
    }
}

export default Toaster;