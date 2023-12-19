import { defineStore } from 'pinia'

export const useTranscriptStore = defineStore('transcript', {
    state: () => {
        return { scripts: null }
    },
    actions: {
        setTranscript(scripts) {
            this.scripts = scripts;
        },
    },
})