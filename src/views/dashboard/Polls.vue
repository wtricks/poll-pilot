<script setup lang="ts">
import { ref } from 'vue';
import Button from '../../components/Button.vue'
import PollCreateCard from '../../components/PollCreateCard.vue';
import usePolls, { Poll } from '../../store/usePolls';

const show = ref(false);
const currentEditIndex = ref(-1)

const polls = usePolls();

const onEdit = (index: number) => {
    currentEditIndex.value = index;
    show.value = true;
}

const onCreatedOrUpdated = (poll: Poll) => {
    polls.editOrAddPoll(poll);
    currentEditIndex.value = -1;
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
        <li v-for="(poll, index) in polls.polls" class="border p-2 bg-slate-50 hover:bg-slate-100 mb-2 rounded-xl flex items-center">
            <span class="block font-medium">{{ poll.title }}</span>

            <Button variant="secondry" class="ml-auto mr-2" @click="onEdit(index)">
                Edit
            </Button>
            <Button variant="secondry" @click="polls.remove(poll.id)">
                Remove
            </Button>
        </li>
    </ul>

    <p class="mt-12 text-lg text-center font-sans ">
        No polls found
    </p>

    <PollCreateCard v-if="show" @onClose="show = false" :poll="polls.polls[currentEditIndex]" @onCreate="onCreatedOrUpdated" />
</template>