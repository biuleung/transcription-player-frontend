import { defineStore } from 'pinia'

export const useCurrentUserIdStore = defineStore('currentUserId', {
    state: () => {
        return { id: null }
    },
    actions: {
        setId(id) {
            this.id = id;
        },
    },
})