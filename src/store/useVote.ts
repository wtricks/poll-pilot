import { defineStore } from "pinia";
import { reactive, toRaw, watch } from "vue";

const useVote = defineStore('vote', () => {
    const votes = reactive(JSON.parse(window.localStorage.getItem('pp_vote') || '{}') as Record<string, number>)

    const removeVote = (id: string) => {
        delete votes[id];
    }

    const addVote = (id: string, option: number) => {
        votes[id] = option;
    }

    watch(votes, () => {
        window.localStorage.setItem('pp_vote', JSON.stringify(toRaw(votes)))
    },  { immediate: true})

    return { votes, remove: removeVote, add: addVote }
})

export default useVote