<script setup lang="ts">
import PageHeader from '../components/PageHeader.vue';
import usePolls from '../store/usePolls';
import useVote from '../store/useVote';
import useAuth from '../store/useAuth';

const polls = usePolls();
const vote = useVote();
const { user } = useAuth();

const getTotalVote = (total: number) => {
    if (total < 1000) {
        return total.toString();
    } else if (total < 1000000) {
        return (total / 1000).toFixed(1) + 'K';
    } else if (total < 1000000000) {
        return (total / 1000000).toFixed(1) + 'M';
    } else {
        return (total / 1000000000).toFixed(1) + 'B';
    }
}

const onVote = (id: number, option: number) => {
    const index = polls.polls.findIndex(p => p.id == id);
    const current = polls.polls[index];
    const prev = vote.votes[id + '' + user!.id];
    const curr = id + '' + user!.id;
    
    if (!isNaN(prev)) {
        console.log("Prev")
        vote.remove(curr);
        current.options[prev].vote--;

        if (prev != option) {
            current.options[option].vote++;
            vote.add(curr, option);
        }
    } else {
        current.options[option].vote++;
        vote.add(curr, option);
    }

    polls.editOrAddPoll(current);
}

</script> 

<template>
    <PageHeader />

    <div class="container mx-auto flex pt-2 justify-center px-3">
        <div class="w-full max-w-[600px]">
            <div :key="poll.id" v-for="poll of polls.polls" class="w-full p-2 border rounded-2xl px-5 mb-4">

                <h4 class="text-lg text-slate-900 font-bold">{{poll.title}}</h4>
                <p class="text-sm text-slate-800">{{poll.description}}</p>
                
                <ul class="list-none w-full mt-4">
                    <li :key="option.title" v-for="(option, index) in poll.options" :class="`relative w-full border rounded-md p-2 px-3 flex items-center hover:bg-slate-100 cursor-pointer mb-2`" @click="onVote(poll.id, index)">
                        <span :style="{ width: ((vote.votes[poll.id + '' + user!.id] == index) ? Math.floor(option.vote * 100 / poll.options.reduce((p, c) => p + c.vote, 0)) : 0) + '%' }" class="bg-blue-600 absolute top-0 left-0 h-full block transition-all opacity-50"></span>
                        <span class="border-r size-6 flex justify-center items-center mr-2 pr-3 font-semibold">{{ index + 1 }}</span>
                        <span class="text-sm font-medium block ml-3">{{option.title}}</span>
                    </li>
                </ul>

                <div class="flex items-center mt-8 font-bold text-sm">
                    <span>{{getTotalVote(poll.options.reduce((p, c) => p + c.vote, 0))}} vote</span>
                </div>
            </div>
        </div>
    </div>
</template>