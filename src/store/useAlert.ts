import { defineStore } from 'pinia'
import { reactive } from 'vue'

interface Message {
    message: string,
    timer: number,
    id: number
}

const useAlertStore = defineStore('alerts', () => {
    const messages = reactive<Message[]>([]);
    const addMessage = (value: string | Omit<Message, 'id'>) => {
        const message = Object.assign({
            id: Math.random(),
            timer: 3000,
            autoHide: true
        }, typeof value == 'string' ? { message: value } : value);

        setTimeout(onClose, message.timer, message.id);
        messages.push(message)
    }

    const onClose = (id: number) => {
        const index = messages.findIndex(el => el.id == id)
        if (index != -1) {
            messages.splice(index, 1)
        }
    }

    return {
        show: addMessage,
        messages,
        close: onClose
    }
})

export default useAlertStore