<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue';
import Input from '../components/Input.vue'
import Button from '../components/Button.vue'
import Cross from './icons/Cross.vue';
import Plus from './icons/Plus.vue';
import useAlertStore from '../store/useAlert';
import { Poll } from '../store/usePolls';
import useAuth from '../store/useAuth';

const { show } = useAlertStore();

const title = ref("")
const description = ref("")
const options = reactive<({ id: string, value: string }[])>([
    {
        id: 'option1',
        value: ''
    },
    {
        id: 'option2',
        value: ''
    }
])

const props = defineProps<{ poll?: Poll }>()

const emit = defineEmits<{
    onClose: [],
    onCreate: [poll: Poll]
}>()

const addInput = (index: number) => {
    options.splice(index + 1, 0, { id: 'Option'+(index+2), value: '' })
}

const removeInput = (index: number) => {
    if (options.length == 2) {
        show('At least two optins are required.')
        return
    }
    options.splice(index, 1)
}

const onCreated = () => {
    if (!title.value) {
        show('Title is required')
    }

    else if (options.some(op => op.value == '')) {
        show('Some of options are empty.')
    }

    else {
        const data = Object.assign(props.poll || {
            id: Math.random(),
            createdAt: Date.now(),
            createdBy: useAuth().user!.uid
        }, {
            title: title.value,
            description: description.value,
            updateAt: Date.now(),
            options: options.map((p, i) => {
                if (props.poll) {
                    return {
                        title: p.value,
                        vote: props.poll.options[i]?.vote || 0
                    }
                }

                return { title: p.value, vote: 0 }
            })
        }) as Poll;

        emit('onCreate', data);
        emit('onClose');

        title.value = description.value = '';
        options.splice(0)
        options.push({ id: 'Option1', value: '' })
        options.push({ id: 'Option2', value: '' })
    }
}

watchEffect(() => {
    if (props.poll) {
        const p = props.poll;
        title.value = p.title;
        description.value = p.description;
        options.splice(0)

        p.options.forEach((pl, i) => options.push({ id: 'Option' + (i + 1), value: pl.title}))
    }
})

</script>

<template>
<Teleport to="body">
    <div @click="$emit('onClose')" class="fixed z-40 bg-black opacity-5 top-0 left-0 h-full w-full">
    </div>

    <div class=" fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center">
        <div class="bg-white p-2 rounded-sm w-full max-w-[400px]">
            <h4 class="text-xl font-semibold text-center">Create a Poll</h4>

            <form action="" method="post" class="mt-5 w-full px-4" @submit.prevent="() => {}">
                <Input 
                    id="title"
                    label="Title"
                    class="mb-3 w-full"
                    type="text"
                    placeholder="Title"
                    v-model="title"
                />

                <Input 
                    id="desc"
                    label="Description"
                    class="mb-3 w-full"
                    type="text"
                    placeholder="Description"
                    v-model="description"
                />

                <div class="border w-full my-2"></div>

                <div class="flex items-center mb-3 mt-5" v-for="(input, index) in options" :key="input.id">
                    <div class="w-full">
                        <Input 
                            id="opr1"
                            :label="'Option ' + (index + 1)"
                            class="w-full"
                            type="text"
                            v-model="input.value"
                            :placeholder="'Option ' + (index + 1)"
                        />
                    </div>

                    <Button variant="secondry" class="mt-6 ml-2" @click="addInput(index)">
                        <Plus class="size-4" />
                    </Button>
                    <Button variant="secondry" class="mt-6 ml-2" @click="removeInput(index)">
                        <Cross class="size-4" />
                    </Button>
                </div>

                <Button variant="primary" class="w-full mt-5 flex justify-center" @click="onCreated">
                    {{ poll ? "Update " : 'Create' }}
                </Button>
            </form>
        </div>
    </div>
</Teleport>    
</template>