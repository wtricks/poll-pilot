import { Timestamp, collection, orderBy, limit, getDocs, query, deleteDoc, doc, startAfter, setDoc, getDoc } from "firebase/firestore";
import { defineStore } from "pinia";
import { reactive } from "vue";
import { db } from "../firebase";
import useAuth from "./useAuth";

interface PollOption {
    title: string,
    vote: number
}

export interface Poll {
    title: string,
    description: string,
    uid: string,
    options: PollOption[],
    createdAt: number,
    updatedAt: number,
    createdBy: number,
    votedId: number
}

interface Option {
    limit: number,
    order: [by: keyof Poll, type?: 'desc' | 'asc'],
    reset: boolean,
    insert: 'push' | 'unshift'
}

const usePolls = defineStore('polls', () => {
    const polls = reactive<Poll[]>([]);
    const col = collection(db, 'polls'); 
    const userID = useAuth().user?.uid;

    const fetchMore = async (options: Option) => {
        if (options.reset) {
            // remove everything
            polls.splice(0)
        }

        const start = polls.length
            ? [startAfter(polls[polls.length - 1])]
            : []

        const queryRef = query(col, orderBy(options.order[0], options.order[1]), ...start, limit(options.limit));

        const docs = await getDocs(queryRef);

        docs.forEach(async (d) => {
            const data = await getDoc(doc(collection(db, 'polls', d.id, 'likes'), userID));
            polls[options.insert]({
                uid: d.id,
                votedId: data.exists() ? data.data().vote : -1,
                ...d.data()
            } as Poll)
        })
    }

    const removePoll = async (uid: string) => {
        await deleteDoc(doc(db, 'polls', uid));
        polls.splice(polls.findIndex(poll => poll.uid == uid), 1);
    }

    const createPoll = async (title: string, description: string, options: PollOption[], uid?: string) => {
        const ref = uid ? doc(db, 'polls', uid) : doc(col);
        const data = {
            title: title,
            description: description,
            updatedAt: Timestamp.fromDate(new Date()),
            options: options,
            createdBy: userID,
            ...(uid ? {} : {
                createdAt: Timestamp.fromDate(new Date())
            })
        }

        await setDoc(ref, data, { merge: !!uid })
    }

    const vote = async (index: number, option: number) => {
        const poll = polls[index];
        if (poll.votedId == option) {
            poll.votedId = -1;
            poll.options[option].vote--;

            await deleteDoc(doc(collection(db, 'polls', poll.uid, 'likes'), userID));
        } else if (poll.votedId == -1) {
            poll.votedId = option;
            poll.options[option].vote++;

            await setDoc(doc(collection(db, 'polls', poll.uid, 'likes'), userID), { vote: option });
        } else {
            poll.options[poll.votedId].vote--;
            poll.options[option].vote++;
            poll.votedId = option;

            await setDoc(doc(collection(db, 'polls', poll.uid, 'likes'), userID), { vote: option }, { merge: true });
        }

        await setDoc(doc(db, 'polls', polls[index].uid), { options: polls[index].options  }, { merge: true })    
    }

    fetchMore({ limit: 10, reset: false, order: ['createdAt', 'asc'], insert: 'push' })

    return { polls, create: createPoll, fetch: fetchMore, remove: removePoll, vote }
})

export default usePolls