// stores/panel-visible.js
import { defineStore } from 'pinia'

export const usePanelVisibleStore = defineStore('panelVisible', {
    state: () => {
        return { isVisible: true }
    },
    actions: {
        toggle() {
            this.isVisible = !this.isVisible;
        },
    },
})