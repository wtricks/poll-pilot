import { defineStore } from "pinia";
import { reactive, toRaw, watch } from "vue";

interface PollOption {
    title: string,
    vote: number
}

export interface Poll {
    title: string,
    description: string,
    id: number,
    options: PollOption[],
    createdAt: number,
    updatedAt: number,
    createdBy: number
}

const usePolls = defineStore('polls', () => {
    const polls = reactive<Poll[]>(JSON.parse(window.localStorage.getItem('pp_polls') || '[]') as Poll[]);

    const editOrAddPoll = (poll: Poll) => {
        const index = polls.findIndex(p => p.id == poll.id);
        if (index == -1) {
            polls.push(poll)
        } else {
            polls[index] = poll;
        }
    }

    const removePoll = (id: number) => {
        const index = polls.findIndex(p => p.id == id);
        if (index != -1) {
            polls.splice(index, 1)
        }
    }

    const findBy = <T extends keyof Poll>(by: T, prop: string | number) => {
        const index = polls.findIndex(p => p[by] == prop);
        if (index == -1) {
            return null;
        }

        return polls[index];
    }

    watch(polls, () => {
        window.localStorage.setItem('pp_polls', JSON.stringify(toRaw(polls)))
    }, { immediate: true})

    return { polls, findBy, remove: removePoll, editOrAddPoll }
})

export default usePolls