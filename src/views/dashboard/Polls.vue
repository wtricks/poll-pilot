<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from '../../components/Button.vue'
import PollCreateCard from '../../components/PollCreateCard.vue';
import usePolls, { Poll } from '../../store/usePolls';
import useAlertStore from '../../store/useAlert';

const show = ref(false);
const currentEditIndex = ref("")
const { show: s } = useAlertStore()

const polls = usePolls();

const getPoll = computed(() => {
    return polls.polls[polls.polls.findIndex(poll => poll.uid == currentEditIndex.value)]
})

const onEdit = (uid: string) => {
    currentEditIndex.value = uid;
    show.value = true;
}

const onCreatedOrUpdated = (title: string, description: string, vote: Poll['options']) => {
    // create or update
    polls.create(title, description, vote, currentEditIndex.value);

    if (currentEditIndex.value) {
        // find index in polls
        const index = polls.polls.findIndex(poll => poll.uid == currentEditIndex.value);

        polls.polls[index].title = title;
        polls.polls[index].description = description;
        polls.polls[index].options = vote;
    
        s('Poll with ID: ' + currentEditIndex.value + ' is updated.');
    } else {
        polls.fetch({ limit: 1, reset: false, order: ['createdAt', 'asc'], insert: 'unshift' });

        s('New poll is created.')
    }


    currentEditIndex.value = "";
    show.value = false;
}

const removePoll = (uid: string) => {
    s('Poll with Id: ' + uid + ' is removed.')
    polls.remove(uid);
}

</script>

<template>
    <div class="flex items-center justify-between w-full mb-5">
        <h2 class="text-2xl font-semibold">Polls</h2>

        <Button variant="primary" @click="show = true">
            Create
        </Button>
    </div>

    <ul class="list-none w-full">
        <li v-for="poll of polls.polls" class="border p-2 bg-slate-50 hover:bg-slate-100 mb-2 rounded-xl flex items-center">
            <span class="block font-medium">{{ poll.title }}</span>

            <Button variant="secondry" class="ml-auto mr-2" @click="onEdit(poll.uid)">
                Edit
            </Button>
            <Button variant="secondry" @click="removePoll(poll.uid)">
                Remove
            </Button>
        </li>
    </ul>

    <p v-if="polls.polls.length == 0" class="mt-12 text-lg text-center font-sans">
        No polls found
    </p>

    <PollCreateCard v-if="show" @onClose="show = false" :poll="getPoll" @onCreate="onCreatedOrUpdated" />
</template>